window.onload = function () {
    if (!window.location.hash) {
        window.location = window.location+'#loaded';
        window.location.reload();
    }
}
function foo1() {
    if (navigator.connection && !!navigator.connection.effectiveType) {
        let type = navigator.connection.effectiveType;
        document.cookie = "page1type=" + type;
        downlink = navigator.connection.downlink * 125 ; // kilobits * 125 = kilobytes;
        document.cookie = "page1dl=" + downlink;
        window.location.replace("first");
    }
  
   // return;

}

function foo2() {
    if (navigator.connection && !!navigator.connection.effectiveType) {
        let type = navigator.connection.effectiveType;
        document.cookie = "page2type=" + type;
        downlink = navigator.connection.downlink * 125; // kilobits * 125 = kilobytes;
        document.cookie = "page2dl=" + downlink;
        // window.location.replace("second/"+type);
        // return;
    }
  
}

function foo3() {
    if (navigator.connection && !!navigator.connection.effectiveType) {
        let type = navigator.connection.effectiveType;
        document.cookie = "page3type=" + type;
    }
    downlink = navigator.connection.downlink * 125; // kilobits * 125 = kilobytes;
    document.cookie = "page3dl=" + downlink;
}