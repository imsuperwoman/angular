import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Output, ViewChild, ViewChildren, EventEmitter, Inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AllianzLocatorService } from './allianz-locator.service';
import JsEasings from '@constants/js-easings.constant';
import smoothScroll from '@functions/smooth-scroll.function';
import Tween from '@classes/tween.class';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { IMAGE_FOLDER } from '@constants/header-constants';
import { GET_AGENT_LOCATOR } from 'module/store/general.action';
import { GeneralSelectors } from 'module/store/general.selectors';
import { Location } from '@angular/common'
import { NavigationService } from '@services/navigation.service';
import { emailRequiredValidator } from '@functions/validator.function';
import { hideChatBot } from '@functions/chatBot.function';
import emailConfirmValidator from '@functions/validator-email-confirm.function';
import { environment } from 'environments/environment';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';

@Component({
  selector: 'shared-app-agent-locator',
  templateUrl: './shared-agent-locator.component.html',
  styleUrls: ['./shared-agent-locator.component.scss']
})
export class SharedAgentLocatorComponent implements AfterViewInit, OnInit {
  @Input('header') header: any;
  @Input('subheader') subheader: any;
  @Input('logo') logo: any;

  @ViewChild('main') main: any;
  @ViewChild('map') map: any;
  @ViewChild('mapHolder') mapHolder: ElementRef | undefined;
  @ViewChild('mobileHeader') mobileHeader: ElementRef | undefined;
  @ViewChild('mobileHeaderAnchor') mobileHeaderAnchor: ElementRef | undefined;
  @ViewChild('searchInput') searchInput: ElementRef | undefined;
  @ViewChild('selectedLocationHolder') selectedLocationHolder: any;
  @ViewChildren('selectedLocationDetail') selectedLocationDetails: any;
  @ViewChild('agentRequiredDialog') agentRequiredDialog: any;


  @Select(GeneralSelectors.selectLov('MOBILEPREFIX')) mobilePrefix$: any;

  mobileMode?: boolean;
  showCard: boolean = false;
  siteHeader: any;
  siteHeaderHeight: number = 0;
  success: boolean = false;
  agentSelected: boolean = false;
  imageFolder: string = IMAGE_FOLDER;


  /** Legneds */
  legendIcons: any = [
    'agent-locator/icon-agents.svg',
  ];

  /** Search */
  searchIsFocused: boolean = false;
  searchTimer: any;
  searchControl: FormControl = this.fb.control('');
  searchAutocomplete: any = [];
  searchAutocompleteIsLoading: boolean = false;
  searchAutocompleteMaxHeight: number = 0;
  mouseIsInAutocomplete: boolean = false;
  searchMarker: any;
  searchLocation: any;

  // Locations
  selectedLocation: any;
  showSelectedLocation: boolean = true;
  showNearbyMarkerLocation: boolean = false;
  nearbyLocations: any = [];
  serviceIsLoading: boolean = false;
  viewLessNearbyLocationsCount: number = 5;
  viewMoreNearbyLocations: boolean = false;

  /** Google */
  placesService: any;

  /** GeoLocation */
  geoLocationMessage?: boolean;

  /** Map */
  pinIcons: any = {
    agent: {
      url: 'agent-locator/pin-agent.svg',
      scaledSize: new google.maps.Size(40, 69),
    },
  };
  mapHeight: number = 0;
  mapOptions: any = {
    center: {
      lat: 3.152509225500085,
      lng: 101.70374731158641,
    },
    gestureHandling: 'greedy',
  };
  markers: any[] = [];

  /*-- Form --*/
  agentLocatorForm: FormGroup = this.fb.group({
    name: new FormControl('', Validators.required),
    phoneCountryCode: new FormControl('+6010', Validators.required),
    mobileNo: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, emailRequiredValidator]),
    emailConfirm: new FormControl('', [Validators.required, emailRequiredValidator]),
    check: new FormControl(false, Validators.requiredTrue),
    agentSelected: new FormControl(false, Validators.requiredTrue),
    checkRecommend: new FormControl(false),
    recaptcha: new FormControl('', Validators.required),
  },
    {
      validators: [emailConfirmValidator.match('email', 'emailConfirm')]
    });

  recaptchaEnabled$: any;
  recaptchaKey: any;

  links = [
    {
      label: 'Find an agent',
      findAgent: true,
      disabled: false,
      header: "Confirm your selected agency and simply fill in all mandatory fields. Our friendly agent will be in touch with you shortly."
    },
    {
      label: "Recommend me an agent",
      findAgent: false,
      disabled: false,
      header: "We will auto assign you our friendly agent, just fill in the mandatory fields and submit."
    }
  ];

  currentLink = this.links[0];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private allianzLocatorService: AllianzLocatorService,
    private elementRef: ElementRef,
    private fb: FormBuilder,
    private _store: Store,
    private location: Location,
    public navigation: NavigationService,
    private action$: Actions,
    public spinnerOverlayService: SpinnerOverlayService,
  ) {
    if (window.location.hostname == 'localhost') {
      this.recaptchaEnabled$ = 'N'
      this.recaptchaKey = environment.recaptcha.siteKey;
    } else {
      this.recaptchaEnabled$ = this._store.selectSnapshot((state) => state.GeneralState.productConfig?.recaptchaEnabled) ? this._store.selectSnapshot((state) => state.GeneralState.productConfig?.recaptchaEnabled) : 'Y';
      this.recaptchaKey = environment.recaptcha.siteKey;
    }
  }

  ngOnInit(): void {
    hideChatBot();
    if (this.recaptchaEnabled$ == 'N') {
      this.agentLocatorForm.get('recaptcha')?.clearValidators();
    } else {
      this.agentLocatorForm.get('recaptcha')?.setValidators(Validators.required);
    }

    this.mobileMode = window.matchMedia('(max-width: 704px)').matches;

    window.matchMedia('(max-width: 704px)').addEventListener('change', () => {
      this.mobileMode = window.matchMedia('(max-width: 704px)').matches;
    });

    const customconfiguration = JSON.parse(
      this.elementRef.nativeElement.getAttribute('customconfiguration')
    );

    if (customconfiguration) {
      if (customconfiguration.imageBasePath) {
        this.imageFolder = customconfiguration.imageBasePath;
      }
    }

    for (let i in this.pinIcons) {
      this.pinIcons[i].url = this.imageFolder + this.pinIcons[i].url;
    }

    /*---- User Geolocation ----*/
    let geolocation = navigator.geolocation;
    var coord: any = '';
    geolocation.getCurrentPosition(
      (position) => {
        coord = position.coords;
        this.geoLocationMessage = false;
        this._store.dispatch(new GET_AGENT_LOCATOR(coord));
      },
      (err) => {
        this.geoLocationMessage = true;
        this._store.dispatch(new GET_AGENT_LOCATOR(""));
      }
    );

    this.action$.pipe(ofActionSuccessful(GET_AGENT_LOCATOR)).subscribe(() => {
      this.spinnerOverlayService.showLoadOverlay();
      var locatorData$ = this._store.selectSnapshot((state) => state.GeneralState.agentLocator.AgentList);
      if (locatorData$.length > 0) {
        this.onAutocompleteItemClick(locatorData$[0])
      }
      this.spinnerOverlayService.hideLoadOverlay();
    });
  }

  ngAfterViewInit(): void {
    this.spinnerOverlayService.showLoadOverlay();
    if (document) {
      this.siteHeader = document.querySelector('.c-header');

      if (this.siteHeader) {
        this.siteHeaderHeight = this.siteHeader.clientHeight;
      }
    }
    if (
      this.map &&
      window.google &&
      window.google.maps &&
      window.google.maps.places &&
      window.google.maps.places.PlacesService
    ) {
      this.placesService = new google.maps.places.PlacesService(this.map.googleMap);
      this.searchControl.valueChanges.subscribe(() => {
        const query: string = this.searchControl.value;
        clearTimeout(this.searchTimer);

        if (!query) {
          return;
        }

        this.searchAutocompleteIsLoading = true;

        this.searchTimer = setTimeout(() => {
          if (query) {
            this.allianzLocatorService
              .getLocationsAndGooglePlaces({
                query,
                placesService: this.placesService,
              })
              .subscribe(([allianzLocations, googlePlacesLocations]) => {
                var googleFilterList = googlePlacesLocations.filter((item: any) =>
                  item.types.indexOf("sublocality_level_1") > -1 || item.types.indexOf("locality") > -1
                  || item.types.indexOf("political") > -1
                );
                var allLocations: any;
                if (allianzLocations.length > 0) {
                  allLocations = allianzLocations
                    .concat(googleFilterList)
                    .sort(function (a: any, b: any) {
                      var nameA = (a.name ? a.name : a.Name).toLowerCase();
                      var nameB = (b.name ? b.name : b.Name).toLowerCase();

                      if (nameA > nameB) return 1;
                      if (nameA < nameB) return -1;
                      return 0;
                    });
                } else {
                  allLocations = googleFilterList;
                }
                this.searchAutocomplete = allLocations;
                this.searchAutocompleteIsLoading = false;
                this.changeDetectorRef.detectChanges();
              });
          } else {
            this.searchAutocomplete = [];
          }
        }, 400);
      });
    }
    this.resizeMap();
    this.spinnerOverlayService.hideLoadOverlay();
  }

  /*---- Event handlers ----*/

  @HostListener('window:resize') onWindowResize(): void {
    if (this.siteHeader) {
      this.siteHeaderHeight = this.siteHeader.clientHeight;
    }

    this.resizeMap();
  }

  onMobileSearchFocus(): void {
    this.searchIsFocused = true;
    this.scrollToMobileHeaderIfNeeded();
  }

  onMobileSearchBlur(): void {
    // Need a short delay before hiding the search field, because
    // the position of the reset button is different between
    // the focused state and non-focused state of the search field.
    setTimeout(() => {
      this.searchIsFocused = false;
    }, 1000 / 60);
  }

  onSearchResetClick(): void {
    this.searchControl.setValue('');
    this.selectedLocation = undefined;
    this.searchLocation = undefined;
    this.searchMarker = undefined;
    this.markers = [];
    this.nearbyLocations = [];
    this.searchInput?.nativeElement.focus();
    this.resizeMap();
    this.agentLocatorForm.controls?.agentSelected.setValue(false)
    this.agentSelected = false;
  }

  onAutocompleteItemClick(location: any): void {
    this.selectedLocation = location;
    this.showSelectedLocation = true;
    this.searchLocation = location;
    this.searchMarker = {
      position: this.getLatLng(location),
      options: {
        icon: this.getPinIconForLocation(location),
        zIndex: 99999,
      },
    };
    this.markers = [];
    this.nearbyLocations = [];
    this.mouseIsInAutocomplete = false;
    this.resizeMap();

    if (location?.geometry != undefined) {
      var coord = {
        latitude: location.geometry.location.lat(),
        longitude: location.geometry.location.lng()
      }
      this._store.dispatch(new GET_AGENT_LOCATOR(coord)).subscribe(action => this.doNearbyLocationSearch());
    }
    this.doNearbyLocationSearch();
  }

  onNearbyLocationClick(location: any): void {
    this.selectedLocation = location;
    this.showNearbyMarkerLocation = true;
    this.resizeMap();
    this.panMapTo(location);
    this.scrollToMobileHeaderIfNeeded();
    this.scrollMaintoTop();
  }

  onMarkerClick(index: number): void {
    this.selectedLocation = this.nearbyLocations[index];
    this.showNearbyMarkerLocation = true;
    this.resizeMap();
    this.panMapTo(this.selectedLocation);
    this.scrollToMobileHeaderIfNeeded();
    this.scrollMaintoTop();
  }

  onSearchMarkerClick(): void {
    this.selectedLocation = this.searchLocation;
    this.resizeMap();
    this.panMapTo(this.selectedLocation);
    this.scrollToMobileHeaderIfNeeded();
    this.scrollMaintoTop();
  }

  /*---- Methods ----*/

  doNearbyLocationSearch(): void {
    if (!this.searchLocation) {
      return;
    }

    let locationLatLng = this.getLatLng(this.searchLocation);

    this.serviceIsLoading = true;

    this.allianzLocatorService
      .getNearbyLocations()
      .subscribe((nearbyLocations: any) => {
        this.nearbyLocations = nearbyLocations;

        if (this.nearbyLocations != undefined) {
          this.markers = nearbyLocations.map((location: any) => {
            return {
              position: this.getLatLng(location),
              options: {
                icon: this.getPinIconForLocation(location),
              },
            };
          });
        }
        if (this.selectedLocation) {
          this.map.panTo(this.getLatLng(this.selectedLocation));
        } else {
          this.map.panTo(locationLatLng);
        }

        this.serviceIsLoading = false;
        this.viewMoreNearbyLocations = false;
        this.resizeMap();
        // this.scrollToMobileHeaderIfNeeded();
      });
  }

  getPinIconForLocation(location: any): any {
    return this.pinIcons.agent;
  }

  resizeMap(): void {
    if (window && this.mapHolder && this.mapHolder.nativeElement) {

      let newMapHeight: number = window.innerHeight;
      let siteHeaderHeight: number = 0;

      /*---- Offset mobile site header height ----*/

      if (window && this.siteHeader) {
        const siteHeaderPosition: any = window.getComputedStyle(this.siteHeader);

        if (siteHeaderPosition.position === 'fixed') {
          siteHeaderHeight = this.siteHeader.clientHeight;
        }
      }

      newMapHeight -= siteHeaderHeight;

      /*---- Offset mobile locator header height ----*/

      const mobileHeaderHeight: number =
        this.mobileHeader && this.mobileHeader.nativeElement
          ? this.mobileHeader.nativeElement.clientHeight
          : 0;

      newMapHeight -= mobileHeaderHeight;

      /*---- Offset selected location height / fixed height for nearby locations, only for mobile ----*/

      if (mobileHeaderHeight) {
        if (this.selectedLocationDetails.length > 2) {
          newMapHeight -= this.selectedLocationDetails.get(2).nativeElement.offsetTop;
        } else if (this.selectedLocationHolder) {
          newMapHeight -= this.selectedLocationHolder.nativeElement.clientHeight;
        } else if (this.nearbyLocations.length) {
          newMapHeight -= 125;
        }
      }

      this.searchAutocompleteMaxHeight = window.innerHeight - siteHeaderHeight - mobileHeaderHeight;
      this.mapHeight = newMapHeight;
      this.changeDetectorRef.detectChanges();
    }
  }

  getOffsetTopOf(elementRef: ElementRef | undefined): number {
    let offsetTop = 0;
    let offsetElement = elementRef?.nativeElement;

    while (offsetElement) {
      offsetTop += offsetElement.offsetTop;
      offsetElement = offsetElement.offsetParent;
    }

    return offsetTop;
  }

  getContactNumberFromLocation(location: any): string | void {
    const contactNo: any = location.ContactNo;

    if (contactNo.mobile) return contactNo.mobile;
    if (contactNo.phone) return contactNo.phone;
    if (contactNo.toll_free) return contactNo.toll_free;
    if (contactNo.Agic) return contactNo.Agic;
    if (contactNo.Alim) return contactNo.Alim;

    return;
  }

  getAddressWithoutTags(address: string): string {
    return address.replace(/,<br>/gi, ' ').replace(/<br>/gi, ', ');
  }

  panMapTo(location: any): void {
    this.map.panTo({
      lat: location.Latitude ? location.Latitude : location.geometry.location.lat(),
      lng: location.Longitude ? location.Longitude : location.geometry.location.lng(),
    });
  }

  scrollToMobileHeaderIfNeeded(): void {
    this.changeDetectorRef.detectChanges();

    let targetScrollPosition = this.getOffsetTopOf(this.mobileHeaderAnchor);

    if (window && this.siteHeader) {
      const siteHeaderPosition: any = window.getComputedStyle(this.siteHeader);

      if (siteHeaderPosition.position === 'fixed') {
        targetScrollPosition -= this.siteHeader.clientHeight;
      }
    }

    smoothScroll(targetScrollPosition);
  }

  getLatLng(location: any): any {
    return {
      lat: location.Latitude ? location.Latitude : location.geometry.location.lat(),
      lng: location.Longitude ? location.Longitude : location.geometry.location.lng(),
    };
  }

  scrollMaintoTop(): void {
    new Tween({
      from: {
        y: this.main.nativeElement.scrollTop,
      },
      to: {
        y: 0,
      },
      onStep: (step: any) => {
        this.main.nativeElement.scrollTo(0, step.y);
      },
      easing: JsEasings.EaseOutQuint,
      duration: 800,
    }).start();
  }

  back(): void {
    this.location.back()
  }

  agentRequiredDialogHeader = 'Agent required to proceed';
  agentRequiredDialogDescription = `We're unable to process your request due to our online risk acceptance controls. Please use our Agent Finder to find an agent nearest to you that can assist you further.`;


  @Output('agentLocatorEvent') agentLocatorEvent: any = new EventEmitter();
  onSubmit() {
    const formValue = this.agentLocatorForm.getRawValue();
    this.agentLocatorEvent.emit({ formValue: formValue, selectedLocation: this.selectedLocation });
    this.success = true;
    document.getElementById("siteheader")?.scrollIntoView();
  }

  scrollToForm() {
    document.getElementById("form")?.scrollIntoView();
  }

  setActiveLink(link: any) {
    if (!link.disabled) {
      this.currentLink = link;
    }

    if (link.findAgent) {
      this.agentLocatorForm.get('check')?.setValue(false);
      this.agentLocatorForm.get('agentSelected')?.setValue(false);
      this.agentLocatorForm.get('checkRecommend')?.setValidators([]);
      this.agentLocatorForm.get('checkRecommend')?.setValue(false);
    } else {
      this.showCard = false;
      this.agentLocatorForm.get('checkRecommend')?.setValidators(Validators.requiredTrue);
      this.agentLocatorForm.controls?.agentSelected.setValue(true);
      this.agentLocatorForm.get('check')?.setValue(false);
      this.agentLocatorForm.get('checkRecommend')?.setValue(false);
    }
  }

}

export const SUGER_STATE: { [key: string]: string } = {
  WPN: <any>'FEDERAL TERRITORY OF KUALA LUMPUR',
  PJY: <any>'FEDERAL TERRITORY OF PUTRAJAYA',
  LBN: <any>'FEDERAL TERRITORY OF LABUAN',
  PPN: <any>'PENANG',
}