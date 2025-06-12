import { 
  CardHeader, Card, CardContent, CardActions, Skeleton, Typography, CardMedia, Button 
} from "@mui/material";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import { FC, useEffect, useState } from "react";
import { UnitofAction } from "@/action/UnitofAction";
import { ServiceResponse, PaginationResponse } from "@/interfaces/ServiceResponse";
import { useToasted } from "@/context/ContextHook/ToastedContext";

interface EscapeGameDetailProps {
  Id?: number | null | undefined;
}

const EscapeGameDetail: FC<EscapeGameDetailProps> = ({ Id }) => {
  const action = new UnitofAction();
  const [escapeGame, setEscapeGame] = useState<GetEscapeGameDto | null>(null);
  const notif = useToasted();

  const buttonlst = [
    { label: "Session", url: "../SessionGame/SessionGameList.tsx" },
    { label: "Activity place", url: "../../ActivitityPlace/ActivitityPlaceList" },
    { label: "Organisation", url: "" },
    { label: "Avis", url: "../Rating/RatingList" },
  ];

  const fetchEscape = async (id: number) => {
    try {
      const response: ServiceResponse<GetEscapeGameDto> | PaginationResponse<GetEscapeGameDto> = 
        await action.escapeGameAction.getEscapeGameById(id);

      if (response.Success) {
        setEscapeGame(response.Data as GetEscapeGameDto);
        notif.showToast(response.Message, "success");
        notif.isvisible = true;
      } else {
        notif.showToast(response.Message, "error");
        notif.isvisible = true;
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Charge uniquement si Id est défini et positif
    if (Id !== undefined && Id !== null && Id > 0) {
      fetchEscape(Id);
    }
  }, [Id]);

  // Affichage du skeleton pendant le chargement ou si Id absent/non valide
  if (!Id || Id <= 0 || !escapeGame) {
    return (
      <Card>
        <CardHeader title={<Skeleton />} />
        <CardContent>
          <Skeleton />
        </CardContent>
        <CardActions>
          {buttonlst.map((item) => (
            <Button key={item.label} href={item.url}>
              {item.label}
            </Button>
          ))}
        </CardActions>
      </Card>
    );
  }

  // Affichage des détails quand escapeGame est chargé
  return (
    <Card>
      <CardHeader 
        title={<Typography>{escapeGame.esgTitle}</Typography>}
      />
      {escapeGame.esgImgResources && (
        <CardMedia
          component="img"
          height="194"
          image={escapeGame.esgImgResources}
          alt={escapeGame.esgTitle}
        />
      )}
      <CardContent>
        {[
          { label: "Id", value: escapeGame.esgId?.toLocaleString() },
          { label: "Title", value: escapeGame.esgTitle },
          { label: "Description", value: escapeGame.esgContent },
          { label: "PhoneNumber", value: escapeGame.esgPhoneNumber },
          { label: "Difficulty", value: escapeGame.esg_DILE_Id },
          { label: "Price", value: escapeGame.esg_Price_Id },
          { label: "Pour Enfants", value: escapeGame.esg_IsForChildren ? "Oui" : "Non" },
        ].map((item) => (
          <Typography key={item.label}>{`${item.label}: ${item.value || ""}`}</Typography>
        ))}
      </CardContent>
      <CardActions>
        {buttonlst.map((item) => (
          <Button key={item.label} href={item.url}>
            {item.label}
          </Button>
        ))}
      </CardActions>
    </Card>
  );
};

export default EscapeGameDetail;
