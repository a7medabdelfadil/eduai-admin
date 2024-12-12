import { CometChat } from "@cometchat-pro/chat";

// لإنشاء مستخدم جديد
export const createUser = async (uid: string, name: string): Promise<void> => {
  // التأكد من أن الكود يعمل فقط في المتصفح
  if (typeof window !== "undefined") {
    const user = new CometChat.User(uid);
    user.setName(name);

    try {
      await CometChat.createUser(
        user,
        process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY!,
      );
      console.log("User created successfully:", user);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  } else {
    console.log("createUser function cannot run on the server.");
  }
};

// لتسجيل دخول المستخدم
export const loginUser = async (uid: string): Promise<void> => {
  // التأكد من أن الكود يعمل فقط في المتصفح
  if (typeof window !== "undefined") {
    try {
      const user = await CometChat.login(
        uid,
        process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY!,
      );
      console.log("Login successful:", user);
    } catch (error) {
      console.error("Login failed with error:", error);
    }
  } else {
    console.log("loginUser function cannot run on the server.");
  }
};

// لإرسال رسالة
export const sendMessage = async (
  receiverID: string,
  messageText: string,
  receiverType = CometChat.RECEIVER_TYPE.USER,
): Promise<void> => {
  // التأكد من أن الكود يعمل فقط في المتصفح
  if (typeof window !== "undefined") {
    const textMessage = new CometChat.TextMessage(
      receiverID,
      messageText,
      receiverType,
    );

    try {
      const message = await CometChat.sendMessage(textMessage);
      console.log("Message sent successfully:", message);
    } catch (error) {
      console.error("Message sending failed:", error);
    }
  } else {
    console.log("sendMessage function cannot run on the server.");
  }
};

// لإرسال رسالة صورة
export const sendImageMessage = async (
  receiverID: string,
  file: File,
  receiverType = CometChat.RECEIVER_TYPE.USER,
): Promise<void> => {
  // التأكد من أن الكود يعمل فقط في المتصفح
  if (typeof window !== "undefined") {
    const mediaMessage = new CometChat.MediaMessage(
      receiverID,
      file,
      CometChat.MESSAGE_TYPE.IMAGE,
      receiverType,
    );

    try {
      const message = await CometChat.sendMessage(mediaMessage);
      console.log("Image message sent successfully:", message);
    } catch (error) {
      console.error("Image message sending failed:", error);
    }
  } else {
    console.log("sendImageMessage function cannot run on the server.");
  }
};

// إضافة مستمع الرسائل
export const addMessageListener = (
  listenerID: string,
  callback: (message: CometChat.TextMessage | CometChat.MediaMessage) => void,
): void => {
  // التأكد من أن الكود يعمل فقط في المتصفح
  if (typeof window !== "undefined") {
    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (message: CometChat.TextMessage) => {
          console.log("Text message received:", message);
          callback(message);
        },
        onMediaMessageReceived: (message: CometChat.MediaMessage) => {
          console.log("Media message received:", message);
          callback(message);
        },
      }),
    );
  } else {
    console.log("addMessageListener function cannot run on the server.");
  }
};
