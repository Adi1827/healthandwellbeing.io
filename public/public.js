function getDetails(){
    fetch('/details',{
        method:"POST",
        headers:{
            'Content-type':'application/json'
        },
        body:body
    })
    .then((response)=>{
        if(response.ok){
            console.log("Successful regustration");
        }
        else{
            console.error("Registration failed:", response.statusText,id);
                    alert("Registration failed");
        }
    })
    .catch((err)=>{
        if(err){
            throw new Error("Cannot find the specified Link!")
        }
    })  
}

function userLogOut(){
    fetch('/logout')
    .then((response),()=>{
        if(response.ok){
            console.log("Logged Out");
        }
        else{
            console.err("Logging Out Failed...",response.statusText)
        }
    })
    .catch(err=>{
        if(err){
            console.error("Network error:",err);
            alert("Network Error")
        }
    })
}