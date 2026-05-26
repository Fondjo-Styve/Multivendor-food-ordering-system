export const createCustomError=(status,message)=>{
    const customError=new Error(message);
    customError.status=status;
    return customError;
}