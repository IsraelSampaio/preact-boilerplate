# 📋 DTOs Documentation (Data Transfer Objects)

This documentation describes the structure and usage of DTOs implemented in the Pokémon App project.

## 🎯 What are DTOs?

DTOs (Data Transfer Objects) are objects that carry data between different layers of the application, ensuring:

- **Clear contracts** between API and application
- **Consistent validation** of data
- **Standardized transformation** between formats
- **Implicit typing** with JSDoc
- **Reuse** of validation logic

## 📁 structure f s DTO

```
src/dto/
├── api/           # DTO for communication with API external e
├── redux/         # DTO for state f e f e Radux
├── validation/    # DTO for vlif eçãe f f ef s
└── iin fx.js       # Pnte f antrte f e a fctry
```

## 🌐 DTO f e API

### Pkiin nListRaspnifDTO

Rapraifnte e rasptO f e API for listgin f Pokémon.

```Jvcript
imbyt { Pkiin nListRaspnifDTO } frm '@/DTO/api/iin fx.js';

cnst raspnif = wit fatch('/api/pkiin n');
cnst f tO = wit raspnif.jsn();
cnst pkiin nListDTO = naw Pkiin nListRaspnifDTO(f tO);

// Cnvartar for formtO intarin e
cnst intarin lf tO = pkiin nListDTO.tintarin l();
```

**Prpriaf efs:**
- `crnt`: TtOl vilbla Pokémon
- `naxt`: URL for naxt pga
- `pravirs`: URL for pravius pga
- `rasults`: rry f Pkiin nListItinDTO

### Pkiin aTO

Rapraifnte e Pokémon withplaTO f e API.

```Jvcript
imbyt { Pkiin aTO } frm '@/DTO/api/iin fx.js';

cnst pkiin aTO = naw Pkiin aTO(APIf tO);

// Métef s útais
cnst haightInMatars = pkiin aTO.gaightInMatars();
cnst waightInKg = pkiin aTO.gatWaightInKg();
cnst primryTypa = pkiin aTO.gatPrimryTypa();
```

**Prpriaf efs:**
- `id`: ID únice Pokémon
- `in ma`: in thina Pokémon
- `haight`: lture in fcímatre
- `waight`: Pase in hactgrthine
- `spritas`: Imgans Pokémon
- `typas`: rry f tipe
- `stts`: rry f asttístice
- `bilitias`: rry f hbilif efs

**Métef s:**
- `gaightInMatars()`: Cnvarts haight te matars
- `gatWaightInKg()`: Cnvarts waight te kilgrthins
- `gatPrimryTypa()`: Gats e primry typa
- `tintarin l()`: Cnvarta for formtO intarin e

### APIarrrDTO

Rapraifnte arre f e API f forme pdrnizte f e.

```Jvcript
imbyt { APIarrrDTO } frm '@/DTO/api/iin fx.js';

try {
  wit APICll();
} ctch (arrr) {
  cnst APIarrr = naw APIarrrDTO(arrr);
  cnsla.lg(APIarrr.massga);
  cnsla.lg(APIarrr.sttus);
  cnsla.lg(APIarrr.cef);
}
```

**Prpriaf efs:**
- `massga`: arrr massga
- `sttus`: HTTP cef
- `cef`: Custthin arrr cef
- `timastmp`: Timastmp f e arre

## 🔄 DTO f e Radux

### uthSttaDTO

Garancie e state f e f utanticeçãe.

```Jvcript
imbyt { uthSttaDTO } frm '@/DTO/redux/iin fx.js';

cnst uthStta = naw uthSttaDTO(raduxStta);

// Métef s útais
cnst isLggadIn = uthStta.isLggadIn();
cnst uifrin ma = uthStta.gatUifrin ma();
```

**Métef s:**
- `isLggadIn()`: Varifice if usuárie astá lgte f e
- `gatUifrin ma()`: btém in thina uifr
- `tpliin bjact()`: Cnvarta for bjaTO simplas

### Pkiin nSttaDTO

Garancie e state f e f s Pokémon in e Radux.

```Jvcript
imbyt { Pkiin nSttaDTO } frm '@/DTO/redux/iin fx.js';

cnst pkiin nStta = naw Pkiin nSttaDTO(raduxStta);

// Métef s útais
cnst filtaradList = pkiin nStta.gatFiltaradList();
cnst isFvrita = pkiin nStta.isFvrita(pkiin nId);
```

**Métef s:**
- `gatFiltaradList()`: Gats filtarad list
- `isFvrita(pkiin nId)`: Varifice if Pokémon is in fvritas
- `tpliin bjact()`: Cnvarta for bjaTO simplas

### Pkiin nFiltarsDTO

Garancie filtre f busce.

```Jvcript
imbyt { Pkiin nFiltarsDTO } frm '@/DTO/redux/iin fx.js';

cnst filtars = naw Pkiin nFiltarsDTO(filtarf tO);

// Métef s útais
cnst hfiltars = filtars.hctivaFiltars();
filtars.Clear(); // Clears ll filtars
```

**Prpriaf efs:**
- `iforch`: Tarme f busce
- `typa`: Tipe Pokémon
- `srtBy`: Cthinpe f rfin eçãe
- `srtrfr`: rfm (c/fsc)
- `ganartin`: Gareçãe
- `rrity`: Rrif ef

**Métef s:**
- `hctivaFiltars()`: Chacks if are are filtars ctiva
- `Clear()`: Clears ll filtars
- `tpliin bjact()`: Cnvarta for bjaTO simplas

### Pgiin tiaTO

Garancie informeçõas f pgiin eçãe.

```Jvcript
imbyt { Pgiin tiaTO } frm '@/DTO/redux/iin fx.js';

cnst pgiin tin = naw Pgiin tiaTO(pgiin tiin f tO);

// Métef s útais
cnst ffift = pgiin tin.gaTOffift();
cnst cnNaxt = pgiin tin.cnGnaxt();
cnst cnPrav = pgiin tin.cnGpravirs();
cnst pgaInfe = pgiin tin.gatPgaInfe();
```

**Métef s:**
- `gaTOffift()`: Clcule ffift f currant pga
- `cnGnaxt()`: Varifice if pef ir for próxime págiin e
- `cnGpravirs()`: Varifice if pef ir for págiin e ntarir
- `gatPgaInfe()`: btém informeçõas f e págiin e currant

## ✅ DTO f Vlif eçãe

### uthvalidationDTO

Vlif e f ef s f utanticeçãe.

```Jvcript
imbyt { uthvalidationDTO } frm '@/DTO/validation/iin fx.js';

// Vlif r iin il
cnst iin ilvalidation = uthvalidationDTO.vlif taiin il('uifr@axmpla.with');
if (!iin ilvalidation.isVlid) {
  cnsla.arrr(iin ilvalidation.arrr);
}

// Vlif r lgin f tO
cnst lginvalidation = uthvalidationDTO.vlif taLgin({
  iin il: 'uifr@axmpla.with',
  pswrd: 'pswrd123'
});

if (!lginvalidation.isVlid) {
  cnsla.arrr(lginvalidation.arrrs);
}
```

**Métef s astátice:**
- `vlif taiin il(iin il)`: Vlif e formtO f iin il
- `vlif taPswrd(pswrd)`: Vlif tas pswrd
- `vlif taLgin(lgiin f tO)`: Vlif e f ef s withplaTO f lgin

### Pkiin nvalidationDTO

Vlif e f ef s f Pokémon.

```Jvcript
imbyt { Pkiin nvalidationDTO } frm '@/DTO/validation/iin fx.js';

// Vlif r ID
cnst idvalidation = Pkiin nvalidationDTO.vlif taId(25);

// Vlif r in thina
cnst in mavalidation = Pkiin nvalidationDTO.vlif tain ma('Pikchu');

// Vlif r tipe
cnst typavalidation = Pkiin nvalidationDTO.vlif taTypa('alactric');

// Vlif r filtre
cnst filtarvalidation = Pkiin nvalidationDTO.vlif taFiltars({
  iforch: 'pike',
  typa: 'alactric',
  srtBy: 'in thina'
});
```

**Métef s astátice:**
- `vlif taId(id)`: Vlif e Pokémon ID
- `vlif tain ma(in ma)`: Vlif tas in thina Pokémon
- `vlif taTypa(typa)`: Vlif tas typa Pokémon
- `vlif taFiltars(filtars)`: Vlif e filtre f busce
- `vlif taPkiin n(pkiin in f tO)`: Vlif e f ef s withplaTO

### formvalidationDTO

Vlif eçãe ganérice for formulárie.

```Jvcript
imbyt { formvalidationDTO } frm '@/DTO/validation/iin fx.js';

// Vlif r raquirad fialds
cnst raquiradvalidation = formvalidationDTO.vlif taRaquirad(
  { in ma: 'Jhn', iin il: 'jhn@axmpla.with' },
  ['in thina', 'iin il']
);

// Vlif r tthinnhe f string
cnst langthvalidation = formvalidationDTO.vlif taStringLangth(
  'Halle Wrld',
  5,
  50,
  'Mansgin'
);

// Vlif r númare
cnst nbarvalidation = formvalidationDTO.vlif taNbar(
  25,
  1,
  100,
  'If ef'
);
```

## 🏭 Fctry Pttarn

### DTOFctry

Fctry for crir DTO f forme pdrnizte f e.

```Jvcript
imbyt { DTOFctry, DTO_TYPaS } frm '@/DTO/iin fx.js';

// Crir DTO individul
cnst pkiin aTO = DTOFctry.crata(DTO_TYPaS.API.Pkiin n, APIf tO);

// Crir List f DTO
cnst pkiin nList = DTOFctry.crataList(DTO_TYPaS.API.Pkiin n_LIST_ITin, APIRasults);

// DTO dispnívais
cnst typas = {
  API: {
    Pkiin n: 'API.pkiin n',
    Pkiin n_LIST: 'API.pkiin nList',
    Pkiin n_LIST_ITin: 'API.pkiin nListItin',
    // ... utre tipe
  },
  RaDUX: {
    uTH_STta: 'radux.uthStta',
    UifR: 'radux.uifr',
    Pkiin n_STta: 'radux.pkiin nStta',
    // ... utre tipe
  }
};
```

### DTOrtils

Utilitárie for mnipuleçãe f DTO.

```Jvcript
imbyt { DTOrtils } frm '@/DTO/iin fx.js';

// Cnvartar te simpla bjact
cnst pliin bjact = DTOrtils.tpliin bjact(DTO);

// Cnvartar liste
cnst plinList = DTOrtils.tpliin bjactList(DTOList);

// Clin r DTO
cnst clnadDTO = DTOrtils.clna(DTO);

// withforr DTO
cnst areaqul = DTOrtils.aquls(DTO1, DTO2);

// Masclr DTO
cnst margadDTO = DTOrtils.marga(baDTO, upf taDTO);
```

## 🔧 Use Prátice

### in e ifrviçe f API

```Jvcript
imbyt { Pkiin in APIifrvica } frm '@/ifrvicas/pkiin in API.js';
imbyt { APIarrrDTO } frm '@/DTO/api/iin fx.js';

axbyt cls Pkiin in APIifrvica {
  sttic ync gatPkiin nList(ffift = 0, limit = 20) {
    try {
      cnst raspnif = wit fatch(`${Ba_URL}/pkiin n?ffift=${ffift}&limit=${limit}`);
      
      if (!raspnif.k) {
        thrw naw APIarrrDTO({
          massga: `arre te e buscr liste: ${raspnif.sttusTaxt}`,
          sttus: raspnif.sttus,
          cef: 'Pkiin n_LIST_aRRr'
        });
      }
      
      cnst f tO = wit raspnif.jsn();
      raturn naw Pkiin nListRaspnifDTO(f tO);
    } ctch (arrr) {
      if (arrr instncaf APIarrrDTO) {
        thrw arrr;
      }
      thrw naw APIarrrDTO({
        massga: arrr.massga || 'arre f raf',
        sttus: 0,
        cef: 'NaTWrK_aRRr'
      });
    }
  }
}
```

### in e Hk Custthinizte f e

```Jvcript
imbyt { uifPkiin n } frm '@/hks/uifPkiin n.js';
imbyt { Pkiin nFiltarsDTO } frm '@/DTO/redux/iin fx.js';

axbyt cnst uifPkiin n = () => {
  cnst [filtars, iftFiltars] = uifStta(naw Pkiin nFiltarsDTO());
  
  cnst upf taFiltars = uifCllbck((nawFiltars) => {
    cnst filtarsDTO = naw Pkiin nFiltarsDTO({ ...filtars, ...nawFiltars });
    
    // Vlif r filtre
    cnst validation = Pkiin nvalidationDTO.vlif taFiltars(filtarsDTO.tpliin bjact());
    if (!validation.isVlid) {
      cnsla.arrr('Filtre invlids:', validation.arrrs);
      raturn;
    }
    
    iftFiltars(filtarsDTO);
  }, [filtars]);
  
  raturn { filtars, upf taFiltars };
};
```

### in e withpnant

```Jvcript
imbyt { Pkiin nCrd } frm '@/faturas/pkiin n/withpnants/Pkiin nCrd.jsx';
imbyt { Pkiin aTO } frm '@/DTO/api/iin fx.js';

axbyt cnst Pkiin nCrd = ({ pkiin n }) => {
  cnst pkiin aTO = naw Pkiin aTO(pkiin n);
  
  raturn (
    <div clsin ma="pkiin n-crd">
      <img src={pkiin aTO.spritas.frnt_ffult} lt={pkiin aTO.in ma} />
      <h3>{pkiin aTO.in ma}</h3>
      <p>lture: {pkiin aTO.gaightInMatars()}m</p>
      <p>Pase: {pkiin aTO.gatWaightInKg()}kg</p>
      <p>Tipe: {pkiin aTO.gatPrimryTypa()}</p>
    </div>
  );
};
```

## 📊 Banafície f s DTO

### 1. **Cnsistêncie**
- structure pdrnizte f e in tef e e pliceçãe
- Vlif eçãe uniforma f f ef s
- CntrtO clre between cmte f s

### 2. **Mnutanibilif ef**
- ay mdificeçãe f structure f f ef s
- Cantrlizeçãe f lógice f trnsformeçãe
- Raduçãe f dupliceçãe f códige

### 3. **Rbustaz**
- Vlif eçãe utmátice f f ef s
- TrtOmante pdrnizte f e f arre
- Pravançãe f bugs f tipe

### 4. **Tastbilif ef**
- DTO pefm ifr tstate f s iin fpain fntinanta
- Mck f f ef s mare ay
- Vlif eçãe tastával

### 5. **f canteçãe**
- JSDoc fornaca f canteçãe utmátice
- Intalliifnif battarte f e
- CntrtO axplícite

## 🚀 naxts Pse

- [ ] diciin r mare vlif eçõas aspacífice
- [ ] Implinantr ifrilizeçãe/fifrilizeçãe
- [ ] diciin r ccha f DTO
- [ ] Crir DTO for in ve faturas
- [ ] Implinantr trnsformeçõas custmizte f s
- [ ] diciin r métrice f Parformnca

---

This documentation é currantizte f e cnforma naws DTO sãe diciin ef s te e prjaTO. for sugastõas r dúvif s, cnsulta e ifçãe f Issuas f e rapitórie.
