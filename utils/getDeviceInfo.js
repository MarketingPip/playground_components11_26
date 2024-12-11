import {UAParser} from "https://esm.sh/ua-parser-js";
import mobile from "https://esm.sh/is-mobile";
function getDeviceInfo(){
const parser = new UAParser(navigator.userAgent);
 
const osType = parser?.getOS()//
return {os:parser?.getOS().name, browser:parser?.getBrowser().name,mobileDevice:mobile()}
}

export default getDeviceInfo
