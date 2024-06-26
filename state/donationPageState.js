// Initial state object
export const initialState = {
  link: "",
  displayName: "",
  bio: "",
  text: "",
  profilePicture: null,
  twitterLink: "",
  instagramLink: "",
  youtubeLink: "",
  websiteLink: "",
  patreonLink: "",
  userId: null,
};

// Reducer function
export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LINK":
      return { ...state, link: action.payload };
    case "SET_DISPLAY_NAME":
      return { ...state, displayName: action.payload };
    case "SET_BIO":
      return { ...state, bio: action.payload };
    case "SET_TEXT":
      return { ...state, text: action.payload };
    case "SET_PROFILE_PICTURE":
      return { ...state, profilePicture: action.payload };
    case "SET_TWITTER_LINK":
      return { ...state, twitterLink: action.payload };
    case "SET_INSTAGRAM_LINK":
      return { ...state, instagramLink: action.payload };
    case "SET_YOUTUBE_LINK":
      return { ...state, youtubeLink: action.payload };
    case "SET_WEBSITE_LINK":
      return { ...state, websiteLink: action.payload };
    case "SET_PATREON_LINK":
      return { ...state, patreonLink: action.payload };
    case "SET_USER_ID":
      return { ...state, userId: action.payload };
    default:
      return state;
  }
};
