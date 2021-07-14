import * as os from "os"

if(os.platform()==='linux'){
    window.location.replace('linux.html')
}else{
    window.location.replace('windows.html')
}