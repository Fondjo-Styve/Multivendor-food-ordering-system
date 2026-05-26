import {compare, hash} from 'bcrypt';
export const passwordHash=async (password,saltValue)=>{
    const result=await hash(password,saltValue)
    return result;
}

export const passwordCompaire=async(password,saltValue)=>{
    const result=await compare(password,saltValue);
    return result;
}

export const hashOTP=async (verificationCode,saltValue)=>{
    const result=await hash(verificationCode,saltValue);
    return result;
}

export const verificationCodeCompaire=async(verificationCode,saltValue)=>{
    const result=await compare (verificationCode,saltValue);
    return result;
}

export const resetCodeCodeCompaire=async(verificationCode,saltValue)=>{
    const result=await compare (verificationCode,saltValue);
    return result;
}
