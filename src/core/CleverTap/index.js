import { IsCleverTapEnabled, isUserSubscribed, UserSubscribedType} from "app/utility/common";

export function CleverTap_privacy() {
    window.clevertap.privacy.push({ optOut: !IsCleverTapEnabled() }); //set the flag to true, if the user of the device opts out of sharing their data
    // window.clevertap.privacy.push({ useIP: true }); //set the flag to true, if the user agrees to share their IP data
}

export async function CleverTap_UserEvents(EventType, UserSelfData) {

    let userName = `${UserSelfData.firstName} ${UserSelfData.lastName}`
    let User_TypeStatus = ""

    let userData = {
        "Site": {
            "Identity": UserSelfData.userId,
        }
    }


   await UserSubscribedType().then((res)=>{
       if(res){
        User_TypeStatus = res
       }
    });

    if (UserSelfData.firstName || UserSelfData.lastName) {
        userData.Site.Name = userName
    }
    if (UserSelfData.email) {
        userData.Site.Email = UserSelfData.email
    }
    if (UserSelfData.phoneNumber) {
        userData.Site.Phone = UserSelfData.phoneNumber
    }
    if (User_TypeStatus) {
        userData.Site.User_Type = User_TypeStatus
    }

    if (IsCleverTapEnabled()) {
        if (EventType == "ProfileEvent") {

            let ProfileData = {
                "Site": {
                    "Identity": UserSelfData.userId,
                }
            }

            if (UserSelfData.firstName || UserSelfData.lastName) {
                ProfileData.Site.Name = userName
            }
            if (UserSelfData.email) {
                ProfileData.Site.Email = UserSelfData.email
            }
            if (UserSelfData.phoneNumber) {
                ProfileData.Site.Phone = UserSelfData.phoneNumber
            }
            if (UserSelfData.countryName) {
                ProfileData.Site.Country = UserSelfData.countryName
            }
            if (UserSelfData.languageName) {
                ProfileData.Site.Language = UserSelfData.languageName
            }
            if (User_TypeStatus) { 
                ProfileData.Site.User_Type = UserSelfData.subType ? UserSelfData.subType : User_TypeStatus
            }
            

            // console.log("--->", ProfileData)
            window.clevertap.profile.push(ProfileData)
        } else if (EventType == "LoginEvent") {
            // console.log("--->", userData)
            window.clevertap.onUserLogin.push(userData)
        }
    } else {
        // console.log("CleverTap disabled")
    }
}


export function CleverTap_CustomEvents(EventName, payload) {

    if (IsCleverTapEnabled()) {
        // console.log("---->", EventName, payload)
        if (payload) {
            window.clevertap.event.push(EventName, payload);
        } else {
            window.clevertap.event.push(EventName);
        }
    }
}
