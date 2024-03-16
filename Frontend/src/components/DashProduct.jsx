import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashProduct() {
    const { currentUser } = useSelector((state) => state.user);
    const [userProduct, setUserProduct] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModel , setShowModel] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState('');

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const res = await fetch(`/api/products/getproducts`);
          const data = await res.json();
          if (res.ok) {
            setUserProduct(data.products);
            if (data.products.length < 9) {
              setShowMore(false);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      };
    
      fetchPosts(); 
    }, []);
    
    

      const handleShowMore = async () => {
        const startIndex = userProduct.length;
        try {
          const res = await fetch(
            `/api/products/getproducts?userId=${currentUser._id}&startIndex=${startIndex}`
          );
          const data = await res.json();
          if (res.ok) {
            setUserProduct((prev) => [...prev, ...data.products]);
            if (data.products.length < 9) {
              setShowMore(false);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      const handleDeleteProduct = async () => {
        setShowModel(false);
        try {
          const res = await fetch(
            `/api/products/deleteproduct/${productIdToDelete}/${currentUser._id}`,
            {
              method: 'DELETE',
            }
          );
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message); 
          } else {
            setUserProduct((prev) =>
              prev.filter((products) => products._id !== productIdToDelete)
            );
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userProduct.length>0?
      (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Product Image</Table.HeadCell>
              <Table.HeadCell>Product Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Supplier</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
              {userProduct.map((products)=>(
                // eslint-disable-next-line react/jsx-key
                <Table.Body  className='divide-y'  key={products._id}>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>{new Date(products.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                    <Link to='`/product/${products._id}`'>
                       <img
                        src={products.image}
                        alt={products.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                       />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='font-medium text-gray-900 dark:text-white'to={`/product/${products.slug}`}>
                      {products.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{products.category}</Table.Cell>
                  <Table.Cell>{products.supplier}</Table.Cell>
                  <Table.Cell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer'
                        onClick={() => {
                          setShowModel(true);
                          setProductIdToDelete(products._id);
                        }} 
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='text-teal-500 hover:underline'to={`/update-product/${products._id}`}>
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                  </Table.Row>
                 
                </Table.Body>
              ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>

      ):(
        <p>You have no products to show</p>
      )}
        <Modal show={showModel} onClose={()=>setShowModel(false)} popup size='md'>
          <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">Are you sure you want to Delete this Product</h3>
            </div>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteProduct}>
                Yes, I am sure
              </Button>
              <Button color='gray' onClick={() => setShowModel(false)}>
                No, cancel
              </Button>
            </div>
          </Modal.Body>
      </Modal>
    </div>
  )
}

