
export enum NavRoutes {
    NAV_DASHBOARD = "Dashboard",
    BOTTOM_TABS = "BottomTabs",
    ADD_NEWKID = "AddNewKid",
    KID_DETAILS = "KidDetails",
    ADD_NEW_HABIT = 'ADD_NEW_HABIT',
}

export type RootStackParamList = {
    [NavRoutes.NAV_DASHBOARD]: undefined;
    [NavRoutes.BOTTOM_TABS]: undefined;
    [NavRoutes.ADD_NEWKID]: undefined;
    [NavRoutes.KID_DETAILS]: { id: string };
    [NavRoutes.ADD_NEW_HABIT]: undefined;
};

