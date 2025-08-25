
import Swal from 'sweetalert2'

class Messages {

    constructor() {
        
    }

    Error(message){
            Swal.fire({
                title: "Error",
                text: message,
                icon: "error"
            })
            return 1;
        }

    Success(message){
            Swal.fire({
                title: "Success",
                text: message,
                icon: "success"
            })
            return 1;
        }
    
}

const msg = new Messages()

export default msg