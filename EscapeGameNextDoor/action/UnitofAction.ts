import { AdminDemandAction } from './AdminDemandAction';
import { AnnonceService } from './AnnonceAction';
import { CategoryAction } from './CategoryAction';
import { CreadentialAction } from './CreadentialAction';
import { UserAction } from './UserAction';
import { EscapeGameAction } from './EscapeGameAction';
import { NotificationAction } from './NotificationAction';
import { SeanceService } from './SeanceAction';
import { PostAction } from './PostAction';
import { ForumAction } from './ForumAction';
import { SessionAction } from './SessionAction';
import { OrganisationAction } from './OrganisationActions';
import { AccueilAction } from './AccueilAction';
import { AddressAction } from './AddressAction';
import { RatingAction } from './RatingAction';
import { FavorisAction } from './FavorisAction';
import { ModerationAction } from './ModerationAction';
import { PaymentAction } from './PaymentAction';
export class UnitofAction
{
    private readonly AdminDemandAction = new AdminDemandAction();
    private readonly AnnonceAction = new AnnonceService();
    private readonly CategoryAction = new CategoryAction();
    private readonly UserAction = new UserAction();
    private readonly EscapeGameAction = new EscapeGameAction();
    private readonly NotificationAction = new NotificationAction();
    private readonly SeanceAction = new SeanceService();
    private readonly CreadentialAction = new CreadentialAction();
    private readonly PostAction = new PostAction();
    private readonly ForumAction = new ForumAction();
    private readonly SessionAction = new SessionAction();
    private readonly OrganisationAction = new OrganisationAction();
    private readonly AccueilAction = new AccueilAction();
    private readonly AddressAction = new AddressAction();
    private readonly RatingAction   = new RatingAction();
    private readonly FavorisAction = new FavorisAction();
    private readonly ModerationAction = new ModerationAction();
    private  readonly PaymentAction = new PaymentAction();
    //#region Actions
    public get adminDemandAction() { return this.AdminDemandAction; }
    public get annonceAction() { return this.AnnonceAction; }
    public get categoryAction() { return this.CategoryAction; }
    public get userAction() { return this.UserAction; }
    public get escapeGameAction() { return this.EscapeGameAction; }
    public get notificationAction() { return this.NotificationAction; }
    public get seanceAction() { return this.SeanceAction; }
    public get CredentialAction() { return this.CreadentialAction; }
    public get postAction() { return this.PostAction; }
    public get forumAction() { return this.ForumAction; }
    public get sessionAction() { return this.SessionAction; }
    public get organisationAction() { return this.OrganisationAction; }
    public get accueilAction() { return this.AccueilAction; }
    public get addressAction() { return this.AddressAction; }
    public get ratingAction() { return this.RatingAction; }
    public get favorisAction() { return this.FavorisAction; }
    public get moderationAction() { return this.ModerationAction; }
    public get paymentAction() { return this.PaymentAction; }
    //#endregion
}
