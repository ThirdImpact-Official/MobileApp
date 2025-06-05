import { GetActivityPlaceDto} from "../interfaces/EscapeGameInterface/ActivityPlace/getActivityPlaceDto";
import { GetActivityPlaceTypeDto } from "@/interfaces/EscapeGameInterface/ActivityPlace/getActivityPlaceTypeDto";

// Mock data for ActivityPlaceType
const mockActivityPlaceTypes: GetActivityPlaceTypeDto[] = [
    {
        id: 1,
        name: "Indoor",
     
    },
    {
        id: 2,
        name: "Outdoor",
    },
    {
        id: 3,
        name: "Virtual",
    }
];

// Test data for ActivityPlace
export const testActivityPlaces: GetActivityPlaceDto[] = [
    {
        acpId: 1,
        acpEsgId: 1,
        name: "Haunted Mansion",
        description: "Spooky indoor escape game with horror theme",
        activityType: mockActivityPlaceTypes[0],
        activityId: 201,
        address: "123 Mystery Street, Horrorville",
        imgressources: "https://res.cloudinary.com/dhp1nwrfi/image/upload/v1748956148/fsrwgyzplcbge3yiftpw.jpg",
        creationDate: "2023-01-15T10:00:00Z",
        updateDate: "2023-06-20T14:30:00Z"
    },
    {
        acpId: 2,
        acpEsgId: 2,
        name: "Pirate Island",
        description: "Outdoor adventure with pirate treasure hunt",
        activityType: mockActivityPlaceTypes[1],
        activityId: 202,
        address: "456 Treasure Cove, Adventuria",
        imgressources: "https://res.cloudinary.com/dhp1nwrfi/image/upload/v1748956148/fsrwgyzplcbge3yiftpw.jpg",
        creationDate: "2023-02-20T09:15:00Z",
        updateDate: "2023-05-10T11:45:00Z"
    },
    {
        acpId: 3,
        acpEsgId: 3,
        name: "Cyber Hack",
        description: "Virtual reality hacking challenge",
        activityType: mockActivityPlaceTypes[2],
        activityId: 203,
        address: "Online",
        imgressources: "https://res.cloudinary.com/dhp1nwrfi/image/upload/v1748956148/fsrwgyzplcbge3yiftpw.jpg",
        creationDate: "2023-03-10T14:30:00Z",
        updateDate: "2023-09-05T16:20:00Z"
    },
    {
        acpId: 4,
        acpEsgId: 101,
        name: "Mad Scientist Lab",
        description: "Indoor puzzle-solving with science theme",
        activityType: mockActivityPlaceTypes[0],
        activityId: 204,
        address: "789 Experiment Lane, Sciencetown",
        imgressources: "https://res.cloudinary.com/dhp1nwrfi/image/upload/v1748956148/fsrwgyzplcbge3yiftpw.jpg",
        creationDate: "2023-04-05T11:20:00Z",
        updateDate: "2023-08-15T13:10:00Z"
    }
];

// For testing a single activity place
export const testActivityPlace: GetActivityPlaceDto = testActivityPlaces[0];

// For testing empty/null cases
export const emptyActivityPlace: GetActivityPlaceDto = {
    acpId: 0,
    acpEsgId: 0,
    name: "",
    description: "",
    activityType: null,
    activityId: 0,
    address: "",
    imgressources: "",
    creationDate: "",
    updateDate: ""
};

// For testing the table columns (matching your ActivityPlaceColumns definition)
export const testActivityPlaceColumns = [
    { label: "ID", accessor: "acpId" },
    { label: "ID Escape Game", accessor: "acpEsgId" },
    { label: "ID Activité", accessor: "activityId" },
    { label: "Adresse", accessor: "address" },
    { label: "Images", accessor: "imgressources" },
    { label: "Date de création", accessor: "creationDate" },
    { label: "Dernière mise à jour", accessor: "updateDate" }
];