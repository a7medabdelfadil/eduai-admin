import { CometChat } from "@cometchat-pro/chat";

export const initCometChat = (): void => {
  if (typeof window !== "undefined") {
    const appID = process.env.NEXT_PUBLIC_COMETCHAT_APP_ID!;
    const region = process.env.NEXT_PUBLIC_COMETCHAT_REGION!;
    const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();

    CometChat.init(appID, appSetting).then(
      () => {
        console.log("CometChat initialized successfully");
      },
      error => {
        console.error("CometChat initialization failed", error);
      },
    );
  }
};
