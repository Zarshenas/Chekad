import { verifyToken } from "@/utils/auth";

export function GET(req){
    const token = req.cookies.get('token');
    if (!token) {
        return new Response(JSON.stringify({status:"faild",message: "not logged in"}) , {status:401})
    }
    const result = verifyToken(token.value , process.env.SECRET_KEY);
    if(!result){
        return new Response(JSON.stringify({status:"faild",message: "not authorized"}) , {status:401})
    }
    return new Response(JSON.stringify({status:"success",data:result  }) , {status:200})
}