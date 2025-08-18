
import Swal from 'sweetalert2'


function MessageError(message){
    Swal.fire({
        title: "Error",
        text: message,
        icon: "error"
    })
}

export default MessageError