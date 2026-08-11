import { Routes } from '@angular/router';
import { PocetnaStranica } from './pocetna-stranica/pocetna-stranica';
import { LoginStranica } from './login-stranica/login-stranica';
import { RegistrtionStranica } from './registrtion-stranica/registrtion-stranica';
import { TrenerPocetna } from './trener-pocetna/trener-pocetna';
import { KreirajUtakmicu } from './kreiraj-utakmicu/kreiraj-utakmicu';
import { PregledUtakmica } from './pregled-utakmica/pregled-utakmica';
import { TrenerIgraci } from './trener-igraci/trener-igraci';
import { TrenerStatistika } from './trener-statistika/trener-statistika';
import { UtakmicaLive } from './utakmica-live/utakmica-live';
import { UtakmicaLiveKrenula } from './utakmica-live-krenula/utakmica-live-krenula';
import { PregledUtakmicaDetalji } from './pregled-utakmica-detalji/pregled-utakmica-detalji';
import { TrenerProfilIgraca } from './trener-profil-igraca/trener-profil-igraca';
import { IgracStranica } from './igrac-stranica/igrac-stranica';
import { TrenerProfil } from './trener-profil/trener-profil';
import { ResetLozinka } from './reset-lozinka/reset-lozinka';
import { TrenerIzvestaj } from './trener-izvestaj/trener-izvestaj';
import { TrenerShootingChart } from './trener-shooting-chart/trener-shooting-chart';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    // javne rute - ne traze prijavu
    {path: "", component:PocetnaStranica},
    {path: "login-stranica", component:LoginStranica},
    {path: "registration-stranica", component:RegistrtionStranica},
    {path:"reset-lozinka/:token",component:ResetLozinka},

    // sve ostalo trazi prijavu
    {path: "trener-pocetna", component: TrenerPocetna, canActivate: [authGuard]},
    {path: "kreiraj-utakmicu", component: KreirajUtakmicu, canActivate: [authGuard]},
    {path: "pregled-utakmica", component:PregledUtakmica, canActivate: [authGuard]},
    {path: "trener-igraci", component:TrenerIgraci, canActivate: [authGuard]},
    {path: "trener-statistika", component:TrenerStatistika, canActivate: [authGuard]},
    {path:"utakmica-live",component:UtakmicaLive, canActivate: [authGuard]},
    {path:"utakmica-live-krenula",component:UtakmicaLiveKrenula, canActivate: [authGuard]},
    {path:"pregled-utakmica-detalji",component:PregledUtakmicaDetalji, canActivate: [authGuard]},
    {path:"trener-profil-igraca",component:TrenerProfilIgraca, canActivate: [authGuard]},
    {path:"igrac-stranica",component:IgracStranica, canActivate: [authGuard]},
    {path:"trener-profil",component:TrenerProfil, canActivate: [authGuard]},
    {path:"trener-izvestaj",component:TrenerIzvestaj, canActivate: [authGuard]},
    {path:"trener-shooting-chart",component:TrenerShootingChart, canActivate: [authGuard]}
];
