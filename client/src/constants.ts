export const LOGOUT_REDIRECTION_DELAY = 1000;
export const REACT_CALLBACK_PATH = '/oauth/callback/:id';
export const LOGIN_PROMPT = 'Please log in with one of the following providers';
export const BACKEND_CALLBACK_PATH = '/fe/oauth/callback/:id';
export const USER_MANAGEMENT = 'User Management';
export const TEAMS = 'Teams';
export const LOCATIONS_UNIT = 'Locations unit';
export const LOCATIONS_UNIT_GROUP = 'Locations unit group';
export const PRODUCT_CATALOGUE = 'Product Catalogue';
export const TEAM_ASSIGNMENT = 'Team Assignment';
export const ERROR_OCCURRED = 'An error occurred';
export const MANIFEST_RELEASES = 'Manifest Releases';
export const DRAFT_FILES = 'Draft Files';
export const JSON_VALIDATORS = 'JSON Validators';
export const FORM_CONFIGURATION = 'Form Configuration';
export const PLANS = 'Plans';
export const ACTIVE = 'Active';
export const DRAFT = 'Draft';
export const COMPLETE = 'Complete';
export const TRASH = 'Trash';
export const LOCATIONS = 'Locations';
export const USERS = 'Users';
export const ADMIN = 'Admin';
export const MISSIONS = 'Missions';

// URLs
export const URL_ADMIN = '/admin';
export const URL_MISSIONS = '/missions';
export const URL_EXPRESS_LOGIN = '/login';
export const URL_REACT_LOGIN = '/login';
export const URL_LOGOUT = '/logout';
export const URL_HOME = '/';

export const URL_USER = `${URL_ADMIN}/users/list`;
export const URL_USER_EDIT = `${URL_ADMIN}/users/edit`;
export const URL_TEAMS = `${URL_ADMIN}/teams`;
export const URL_TEAM_ADD = `${URL_ADMIN}/teams/add`;
export const URL_TEAM_EDIT = `${URL_ADMIN}/teams/edit/:id`;

export const URL_TEAM_ASSIGNMENT = `${URL_ADMIN}/teams/team-assignment`;

export const URL_BACKEND_LOGIN = '/fe/login';
export const URL_BACKEND_CALLBACK = '/fe/oauth/callback/opensrp';
export const URL_LOCATION_UNIT = `${URL_ADMIN}/location/unit`;
export const URL_LOCATION_UNIT_ADD = `${URL_ADMIN}/location/unit/add`;
export const URL_LOCATION_UNIT_EDIT = `${URL_ADMIN}/location/unit/edit/:id`;
export const URL_LOCATION_UNIT_GROUP = `${URL_ADMIN}/location/group`;
export const URL_LOCATION_UNIT_GROUP_ADD = `${URL_ADMIN}/location/group/add`;
export const URL_LOCATION_UNIT_GROUP_EDIT = `${URL_ADMIN}/location/group/edit/:id`;
export const URL_UPLOAD_JSON_VALIDATOR = `${URL_ADMIN}/form-config/json-validators/upload`;
export const URL_JSON_VALIDATOR_LIST = `${URL_ADMIN}/form-config/json-validators`;
export const URL_DRAFT_FILE_LIST = `${URL_ADMIN}/form-config/drafts`;
export const URL_UPLOAD_DRAFT_FILE = `${URL_ADMIN}/form-config/drafts/upload`;
export const URL_MANIFEST_RELEASE_LIST = `${URL_ADMIN}/form-config/releases`;
