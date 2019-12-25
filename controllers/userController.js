const userCRUD = require('../databaseOperations/userCRUD');
const signup =async (req, res)=>{
    const user = req.body;
    const {name, email, password } = user;
    // if(!name || !email || !password){
    //     return res.json({error:"Fill email or name or password"})
    // }else if(await userCRUD.existEmail(email)){
    //     return res.json({error:"Email already exists"});
    // }else{
        return res.json(await userCRUD.signup(user));
    // }  
}

const login = async(req,res) =>{
    const {email, password } = req.body;
    // if(!email || !password){
    //     return res.json({error:"Fill email or password"});
    // }else
     if(userCRUD.existEmail(email)){
        return res.json(await userCRUD.login({email})) ;
    }
    else{
        return res.json({error:"Email does not exist"});
    }
}
const createPost = async (req,res) =>{
    const {postedValue,id } = req.body;
    return res.json(await userCRUD.createPost(postedValue,id));
}
const search = async (req,res)=>{
    const searchValue = req.body;   
    const searchResult = await userCRUD.search(searchValue.searchValue);
    return res.json(searchResult);
    
}
const searchProfile = async (req, res)=>{
    return res.json(searchProfile);
}

module.exports = {
    signup,
    login,
    createPost,
    search,
    searchProfile
}