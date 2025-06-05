import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import { GetDifficultyLevelDto } from "@/interfaces/EscapeGameInterface/DifficultyLevel/getDifficultyLevelDto";
import { GetPriceDto } from "@/interfaces/EscapeGameInterface/Price/getPriceDto";

export const testEscapeGames: GetEscapeGameDto[] = [
  {
    esgId: 1,
    esgNom: "Haunted Mansion",
    esgCreator: "Escape Masters Inc.",
    esgTitle: "Escape the Haunted Mansion",
    esgContent: "Solve puzzles and escape the haunted mansion before the ghost catches you!",
    esgImgResources: "https://res.cloudinary.com/dhp1nwrfi/image/upload/v1748956148/fsrwgyzplcbge3yiftpw.jpg",
    esgWebsite: "https://escape-masters.com/haunted",
    esgPhoneNumber: "+1234567890",
    esg_IsDeleting: false,
    esg_IsForChildren: false,
    esg_Price_Id: 1,
    esg_DILE_Id: 2,
    price: {
      id: 1,
      indicePrice: 25.99,
    },
    difficultyLevel: {
      dowId: 2,
      dowName: "Medium",
      
    },
    esg_CreationDate: "2023-01-15T10:30:00Z",
    esg_UpdateTime: "2023-06-20T14:45:00Z"
  },
  {
    esgId: 2,
    esgNom: "Pirate Adventure",
    esgCreator: "Escape Fun Co.",
    esgTitle: "Pirate Treasure Hunt",
    esgContent: "Find the pirate's treasure before the ship sinks!",
    esgImgResources: "https://res.cloudinary.com/dhp1nwrfi/image/upload/v1748956148/fsrwgyzplcbge3yiftpw.jpg",
    esgWebsite: "https://escape-fun.com/pirate",
    esgPhoneNumber: "+1987654321",
    esg_IsDeleting: false,
    esg_IsForChildren: true,
    esg_Price_Id: 2,
    esg_DILE_Id: 1,
    price: {
     id: 1,
      indicePrice: 25.99,
    },
    difficultyLevel: {
     dowId: 2,
      dowName: "Medium",
    },
    esg_CreationDate: "2023-03-10T09:15:00Z",
    esg_UpdateTime: "2023-05-05T11:20:00Z"
  },
  {
    esgId: 3,
    esgNom: "Cyber Heist",
    esgCreator: "Tech Escape Games",
    esgTitle: "Cyber Security Challenge",
    esgContent: "Hack into the system and stop the cyber attack before time runs out!",
    esgImgResources: "https://res.cloudinary.com/dhp1nwrfi/image/upload/v1748956148/fsrwgyzplcbge3yiftpw.jpg",
    esgWebsite: "https://tech-escape.com/cyber",
    esgPhoneNumber: "+1122334455",
    esg_IsDeleting: false,
    esg_IsForChildren: false,
    esg_Price_Id: 3,
    esg_DILE_Id: 3,
    price: {
      id: 1,
      indicePrice: 25.99,
    },
    difficultyLevel: {
      dowId: 2,
      dowName: "Medium",
    },
    esg_CreationDate: "2023-05-20T14:00:00Z",
    esg_UpdateTime: "2023-10-15T16:30:00Z"
  }
];

// For testing a single escape game
export const testEscapeGame: GetEscapeGameDto = testEscapeGames[0];

// For testing empty/null cases
export const emptyEscapeGame: GetEscapeGameDto = {
  esgId: 0,
  esgNom: "",
  esgCreator: "",
  esgTitle: "",
  esgContent: "",
  esgImgResources: "",
  esgWebsite: "",
  esgPhoneNumber: "",
  esg_IsDeleting: false,
  esg_IsForChildren: false,
  esg_Price_Id: 0,
  esg_DILE_Id: 0,
  price: null,
  difficultyLevel: null,
  esg_CreationDate: "",
  esg_UpdateTime: ""
};