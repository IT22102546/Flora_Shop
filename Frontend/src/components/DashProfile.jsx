import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from "react-router-dom";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOut, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import  { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const dispatch = useDispatch();
  const { currentUser , loading } = useSelector(state => state.user);
  const [image, setImage] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess , setUpdateSuccess] = useState(null);
  const [updateUserError , setUpdateUserError]=useState(null);
  const [showModel , setShowModel] = useState(false);
   const filePickerRef = useRef(null);
 


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image]);

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(progress.toFixed(0));
      },
      (error) => {
        setImageError("Image size should be less than 5mb");
        console.error("Upload error:", error);
        setImagePercent(null);
        setImage(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
          setImageFileUrl(downloadURL)
          setFormData({ ...formData, profilePicture: downloadURL,})
        }
         
        );
      }
    );
  };
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  };
  const handleSubmit = async(e)=>{
    e.preventDefault();
   
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'PUT',
        headers: {
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        setUpdateUserError(data.message);
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess("User profile updated successfully");
    } catch (error) {
      dispatch(updateUserFailure(error))
      
    }

  }
  const handleDeleteUser = async ()=>{
    try {
      dispatch (deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method : "DELETE"
      });
      const data  = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure());
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  }
  const handleSignOut = async ()=>{
    try {
      await fetch('api/user/signout',{
        method : 'GET'
      })
      dispatch(signOut());
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imagePercent > 0 && imagePercent < 100 && (
            <CircularProgressbar
              value={imagePercent}
              text={`${imagePercent}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imagePercent / 100})`,
                },
              }}
              aria-label='Uploading Image'
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full border-8 border-[lightgray] ${imagePercent && imagePercent < 100 ? 'opacity-60' : ''}`}
            aria-label='User Profile Image'
          />
        </div>
        {imageError && (
          <Alert color='failure'>{imageError}</Alert>
        )}

        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username} onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}onChange={handleChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'onChange={handleChange}
        />
        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
          disabled={loading }
        >
          {loading ? 'Loading..' : 'Update Account'}
        </Button>
        {currentUser.isAdmin && (
          <Link to='/add-product'>
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
              outline
            >
              Add products
            </Button>
          </Link>
        )}

       {currentUser.isAdmin && (
          <Link to='/create-event'>
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
              outline
            >
              Create events
            </Button>
          </Link>
        )}

        {currentUser.isAdmin && (
          <Link to='/add-suppliers'>
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
              outline
            >
              Add Suppliers
            </Button>
          </Link>
        )} 
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
      <span onClick={()=>setShowModel(true)} className='cursor-pointer' >
        Delete Account
      </span>
        <span onClick={handleSignOut} className='cursor-pointer'>
          Sign Out
        </span>
      </div>
      {updateSuccess && (
        <Alert color='success' className='mt-5'>
          {updateSuccess}
        </Alert>
      )}
       {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      <Modal show={showModel} onClose={()=>setShowModel(false)} popup size='md'>
          <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">Are you sure you want to Delete your Account</h3>
            </div>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I am sure
              </Button>
              <Button color='gray' onClick={() => setShowModel(false)}>
                No, cancel
              </Button>
            </div>
          </Modal.Body>
      </Modal>
    
    </div>
   
  );
}
