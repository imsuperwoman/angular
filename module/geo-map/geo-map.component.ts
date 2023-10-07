import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { Store } from "@ngxs/store";
import { SpinnerOverlayService } from "module/spinner-overlay/spinner-overlay.service";
import { GeneralService } from "module/store/general.service";
import { lastValueFrom } from "rxjs";


@Component({
  selector: 'geo-map',
  templateUrl: './geo-map.component.html',
  styleUrls: ['./geo-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GeoMapComponent implements OnInit, AfterViewInit {

  @Input() geoLabel!: string;
  @Input() geoControl!: FormGroup;
  showMap: boolean = true;
  switcher: boolean = true;

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap = {} as GoogleMap;
  @ViewChild('search', { read: ElementRef }) searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('card', { read: ElementRef }) card!: ElementRef<HTMLInputElement>;

  @ViewChild(MapMarker) mapMarker!: MapMarker;
  marker: google.maps.Marker = {} as google.maps.Marker
  markerPosition: google.maps.LatLngLiteral = { lat: 3.1349853, lng: 101.6860558 };
  markerOptions: google.maps.MarkerOptions = {
    title: "Click me!"
  };
  mapOptions!: google.maps.MapOptions

  selectedLocation: google.maps.GeocoderResult = {} as google.maps.GeocoderResult;
  isGeoError: boolean = false;
  geoErrorMessage = 'Please search and select the specific address of your home.';
  mobileMini = false;

  constructor(public spinnerOverlayService: SpinnerOverlayService,
    private _store: Store,
    public generalService: GeneralService,
    private changeDetectorRef: ChangeDetectorRef) {
  }
  ngOnInit() {
    const ios_device = new RegExp(/iPhone|iPad|iPod|Macintosh/, 'i');
    if (ios_device.test(window.navigator.userAgent)) {
      this.mapOptions = {
        center: { lat: 3.1349853, lng: 101.6860558 },
        keyboardShortcuts: false,
        mapTypeControl: false,
        fullscreenControl: false
      };
    } else {
      this.mapOptions = {
        center: { lat: 3.1349853, lng: 101.6860558 },
        keyboardShortcuts: false,
        mapTypeControl: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
        },
      };
    }
  }

  ngAfterViewInit() {

    if (this.geoControl.get('searchControl')?.value !== '') {
      this.switcher = false;
      this.markerPosition = { lat: this.geoControl.get('viewport')?.value.lat, lng: this.geoControl.get('viewport')?.value.lng };
    } else {
      /*---- User Geolocation ----*/
      let geolocation = navigator.geolocation;
      geolocation.getCurrentPosition(
        (position) => {
          let latitude = position.coords.latitude;
          let longitude = position.coords.longitude;
          this.markerPosition = { lat: latitude, lng: longitude };
          // this.geocodeLatLng(latitude, longitude);
        }
      );
    }

    const options = {
      componentRestrictions: {
        country: 'my'
      }
    };

    const regex_mobile = new RegExp(/Android|BlackBerry|Opera Mini|IEMobile/, 'i');
    let browserType = regex_mobile.test(window.navigator.userAgent);

    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(
      event => {
        document.addEventListener(event, () => {
          let pacContainer = document.getElementsByClassName("pac-container")[0];
          if (browserType) {
            if (pacContainer.className == "pac-container pac-logo hdpi fullscreen-pac-container") {
              pacContainer.className = "pac-container pac-logo hdpi"
              document.getElementsByTagName("body")[0].appendChild(pacContainer);
            } else if (pacContainer.className == "pac-container pac-logo hdpi") {
              document.getElementsByClassName("gm-style")[0].appendChild(pacContainer);
              pacContainer.className += " fullscreen-pac-container";
            }
          } else {
            if (window.outerWidth !== screen.width && window.outerHeight !== screen.height) {
              let pacContainerElements = document.getElementsByClassName("pac-container");
              if (pacContainerElements.length > 0) {
                if (pacContainer.className == "pac-container pac-logo hdpi fullscreen-pac-container") {
                  document.getElementsByClassName("gm-style")[0].appendChild(pacContainer);
                } else if (pacContainer.className == "pac-container pac-logo hdpi") {
                  document.getElementsByClassName("gm-style")[0].appendChild(pacContainer);
                  pacContainer.className += " fullscreen-pac-container";
                }
              }
            } else {
              if (pacContainer.className == "pac-container pac-logo hdpi fullscreen-pac-container") {
                pacContainer.className = "pac-container pac-logo hdpi"
                document.getElementsByTagName("body")[0].appendChild(pacContainer);
              }
            }
          }
        })
      })

    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.card.nativeElement);

    if (this.searchInput?.nativeElement) {
      const searchBox = new google.maps.places.Autocomplete(this.searchInput.nativeElement, options);
      searchBox.addListener("place_changed", async () => {
        const place = searchBox.getPlace();

        if (!place.geometry || !place.geometry.location) {
          this.isGeoError = false;
          this.geoErrorMessage = 'Please search and select the specific address of your home.';
          this.geoError();
          return;
        }

        this.isGeoError = true;
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          this.map.fitBounds(place.geometry.viewport);
        }
        this.markerPosition = place.geometry.location.toJSON();
        this.processGeoCode(place);
      })
    }
    this.changeDetectorRef.detectChanges();
  }

  async processGeoCode(results: any) {
    this.isGeoError = false;
    this.geoErrorMessage = 'Please search and select the specific address of your home.';

    await this.opusformattedAddress(results).then(async (opusAddress: any) => {
      if (opusAddress) {
        this.switcher = false;
        let viewport =
        {
          lat: results.geometry.location.lat(),
          lng: results.geometry.location.lng()
        };
        await this.geocode(viewport);
        if (opusAddress?.name) {
          this.geoControl.get('searchControl')?.setValue(opusAddress?.name + ' ' + results.formatted_address);
        } else {
          this.geoControl.get('searchControl')?.setValue(results.formatted_address);
        }
        if (opusAddress !== '') {
          this.geoControl?.get('addressnumber')?.setValue(opusAddress.unitNo ? opusAddress.unitNo : '', { emitEvent: false });
          this.geoControl?.get('address1')?.setValue(opusAddress?.addressLine1 ? opusAddress.addressLine1 : '', { emitEvent: false });
          this.geoControl?.get('address2')?.setValue(opusAddress.addressLine2 ? opusAddress.addressLine2 : '', { emitEvent: false });
          this.geoControl?.get('address3')?.setValue(opusAddress.addressLine3 ? opusAddress.addressLine3 : '', { emitEvent: false });

          if (opusAddress.postcode) {
            this.geoControl?.get('postCode')?.setValue(opusAddress.postcode, { emitEvent: false });
            this.getPostCodeDetails(opusAddress.postcode);
          }
          this.geoControl?.get('viewport')?.setValue(viewport, { emitEvent: true });
          this.geoControl?.get('placeId')?.setValue(opusAddress.placeId, { emitEvent: false });
          this.geoControl?.get('plusCode')?.setValue(opusAddress.plusCode, { emitEvent: false });
        }
      } else {
        this.geoError();
      }
    })
  }

  getPostCodeDetails(postcode: any) {
    if (postcode != null) {
      const lov = this._store.selectSnapshot(state => state.GeneralState.postcodeList);
      const postCodeDetail = lov.find((item: any) => item.Postcode == postcode);

      if (postCodeDetail != undefined) {
        this.geoControl?.get('city')?.setValue(postCodeDetail.CityDescp);
        this.geoControl?.get('state')?.setValue(postCodeDetail.StateDescp);
        this.geoControl?.get('cityCode')?.setValue(postCodeDetail.CityCode);
        this.geoControl?.get('stateCode')?.setValue(postCodeDetail.StateCode);
      }
    } else {
      this.geoControl?.get('city')?.setValue('');
      this.geoControl?.get('state')?.setValue('');
      this.geoControl?.get('cityCode')?.setValue('');
      this.geoControl?.get('stateCode')?.setValue('');
    }
  }

  async geocode(latLong: any): Promise<void> {
    const maps = new google.maps.Geocoder();
    await maps.geocode({ location: latLong }, (results) => {
      this.selectedLocation = results && results.length > 0 ? results[0] : {} as google.maps.GeocoderResult;
    });
  }

  async opusformattedAddress(formattedAddress: any) {
    var postcode, country, cityDesc, stateDesc;

    if (formattedAddress.address_components !== '') {
      formattedAddress.address_components.find((item: any) => {
        if (item.types.includes("locality")) {
          cityDesc = item.long_name
        }
        if (item.types.includes("administrative_area_level_1")) {
          stateDesc = item.long_name
        }
        if (item.types.includes("country")) {
          country = item.long_name
        }
        if (item.types.includes("postal_code")) {
          postcode = item.long_name
        }
      });
    }
    var sourceSystem = this._store.selectSnapshot((state) => state.GeneralState.sourceSystem);
    var productCode = this._store.selectSnapshot((state) => state.GeneralState.productConfig.ProductCode);

    if (country === 'Malaysia') {
      const payload = {
        "name": formattedAddress?.name,
        "formattedAddress": formattedAddress?.formatted_address,
        "cityDesc": cityDesc,
        "stateDesc": stateDesc,
        "countryDesc": country,
        "postcode": postcode,
        "addressType": this.geoControl.get('addressType')?.value,
        "unitNo": "",
        "placeId": formattedAddress?.place_id,
        "quotationNo": '',
        "productCode": productCode,
        "sourceSystem": sourceSystem,
        "plusCode": formattedAddress?.plus_code?.global_code
      };
      const response = await lastValueFrom(this.generalService.getFormattedAddress(payload)).catch((error: any) => {
        return undefined;
      });
      return response;
    } else {
      this.geoErrorMessage = 'Please select an address within Malaysia only.';
      return undefined;
    }
  }

  async newMarker(event: google.maps.MapMouseEvent) {
    this.geoControl.get('searchControl')?.setValue('', { emitEvent: false });
    this.markerPosition = event.latLng!.toJSON();
    this.geocodeLatLng(this.markerPosition.lat, this.markerPosition.lng);
  }

  async geocodeLatLng(lat: any, lng: any): Promise<void> {
    const latlng = {
      lat: lat,
      lng: lng,
    };
    const maps = new google.maps.Geocoder();
    await maps.geocode({ location: latlng }, async (results) => {
      if (results) {
        this.processGeoCode(results[0]);
      }
    });
  }

  geoError() {
    this.isGeoError = true;
    this.clearFromGroup();
  }

  clearFromGroup() {
    this.geoControl?.get('addressnumber')?.setValue('', { emitEvent: false });
    this.geoControl?.get('address1')?.setValue('', { emitEvent: false });
    this.geoControl?.get('address2')?.setValue('', { emitEvent: false });
    this.geoControl?.get('address3')?.setValue('', { emitEvent: false });
    this.geoControl?.get('postCode')?.setValue('', { emitEvent: false });
    this.geoControl?.get('viewport')?.reset({ emitEvent: false });
    this.geoControl?.get('placeId')?.setValue('', { emitEvent: false });
    this.geoControl?.get('plusCode')?.setValue('');
    this.geoControl.get('searchControl')?.setValue('', { emitEvent: false });
  }

  onKeyPress(event?: any) {
    let e = event.keyCode;
    let specialChars = [13];

    if (specialChars.includes(e)) {
      event.preventDefault();
    } else {
      return;
    }
  }
}
