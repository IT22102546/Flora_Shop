import { Alert, Button, Label, TextInput ,Spinner } from "flowbite-react";
import { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import OAuthenticate from "../components/OAuthenticate";



export default function SignUp() {
    const [formData , setFormData] = useState({});
    const[error , setError] = useState(false);
    const[loading , setLoading] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) =>{
        setFormData({...formData, [e.target.id]:e.target.value.trim()});
      };
      const handleSubmit = async (e)=>{
        e.preventDefault();
        if(!formData.username || !formData.email || !formData.password){
            return setError('Please Fill all Fields');
        }
        try{
          setLoading(true);
          setError(false);
          const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
      
          const data = await res.json();
          console.log(data);
          setLoading(false);
         if(data.success == false){
          setError(data.message);
          return;
         }
          navigate('/sign-in')
        }catch(error){
          setLoading(false);
          setError(error.message);
        }
       
        
      }
  return (
    <div className="min-h-screen mt-20">
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-20">
            {/* left */}
            <div className="flex-1">
                <Link to ="/" className="text-5xl font-bold dark:text-white font-tangerine">
                    <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via purple-500 to-pink-500  text-white rounded-lg  size-10/12" >Flora</span>Shop
                </Link>
                <p className="text-sm mt-5 font-cinzel font-gray font-semibold">Join with us to get beautiful flowers to your door step and let us to decorate you from your favourite flowers</p>
            </div>
            {/* right */}
            <div className="flex-1">
                <p className="text-center text-2xl font-cinzel font-semibold ">Sign Up</p>
                <form className="flex flex-col gap-4 mt-5" onSubmit={handleSubmit}>
                    <div>
                        <Label value="Your username"/>
                        <TextInput type="text" placeholder="Username" id="username"  onChange={handleChange}/>
                    </div>
                    <div>
                        <Label value="Your email"/>
                        <TextInput type="email" placeholder="name@company.com" id="email" onChange={handleChange}/>
                    </div>
                    <div>
                        <Label value="Your password"/>
                        <TextInput type="password" placeholder="Password" id="password" onChange={handleChange}/>
                    </div>
                    <Button disabled={loading} gradientDuoTone='purpleToPink' type="submit">{loading ? (
                        <>
                            <Spinner size='sm'/>
                           <span className="pl-3">Loading</span>
                        </>
                       
                    ):'Sign Up'}</Button>
                     <OAuthenticate/>
                </form>
                <div className="flex gap-2 text-sm mt-5 ">
                    <span>Have an Account?</span>
                    <Link to='/sign-in' className="text-blue-500">Sign In</Link>
                </div>
                {
                    error && (
                        <Alert className="mt-5" color='failure'>
                            {error} 
                        </Alert>
                    )
                }
            </div>
           
        </div>
    </div>
  )
}
