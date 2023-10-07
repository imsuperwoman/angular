# Developer

ABS
https://getquote.allianz.com.my/microsite/business-shield/P1P2P3/get-info


# AZOL Logic
//flowType = 'DIRECT';'STAFFR'; 'REFERRAL'; 'BANK';'AGENT';


## AZOL Test Case
### SHC
### Test Case callEligibility
```
UAT: 890909101111
UAT: OLD_IC :A0596272

ALim 30% 
821215145564
```

### Test Case Bundle
```
?utm_source=HSBCBN&bundle=HH-Landlord-Plus_P1P1P1P1P1_V1
?utm_source=SCOL&p_channel=SCSTAFF&bundle=ALL_P1P1P1P1P1_V1 
?bundle=JEETAKCHOON
```

### Test Case Auto complete flow
```
?utm_source=chatbot&p_ownerType=HO&p_propertyType=LD&p_postCode=52200&p_materialType=Y&p_si=200000&p_bankLoan=N&p_tenant=N&p_psid=3169224803119178&utm_campaign=shc_aida
```
### Test Case Many plans
```
?utm_source=SCOL&p_channel=SCSTAFF&bundle=ALL_P1P1P1P1P1_V1
```
### Test flood-prone postcode
```
Jalan Bukit Sekilau 1
Postcode 28000
25200
28400
```

## Test Case Defualt Email Domain
```
?utm_source=STAFFR
occ06@allianz.com.my
G_OPENAPI
SELECT * FROM OAPI_DIM_AGENT WHERE AGENT_CODE ='MT22823'
```

## Test Case HSBC Case
```
?utm_source=HSBCBN
436480
436481
476677
G_OPENAPI
SELECT * FROM CMGC_CODE_DET WHERE TYPE = 'HSBCINCARDS'
```

### Test Case checkSanction 
```
FULL NAME : TEST CUST
```

### Test Case UBB
blacklisted NRIC : 770407105666

## date-field/date-field.module
Add in module
DateFieldModule,
NxMomentDateModule