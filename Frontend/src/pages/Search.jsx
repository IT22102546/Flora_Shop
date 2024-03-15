import { TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


export default function Search() {
    
    const[sideBarData , setSideBarData] = useState({
        searchTerm : '',
        sort : 'desc',
        category : 'uncategorized', 
    });

    console.log(sideBarData);

    const[posts , setProducts] = useState([]);
    const[loading , setLoading] = useState([]);
    const[showMore , setShowMore] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        if(searchTermFromUrl || sortFromUrl || categoryFromUrl){
            setSideBarData({
                ...sideBarData,
                searchTerm:searchTermFromUrl,
                sort:sortFromUrl,
                category:categoryFromUrl
            })
        }
        const fetchProducts = async  () =>{
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/products/getproducts?${searchQuery}`)
            if(!res.ok){
                setLoading(false);
                return
            }
            if(res.ok){
                const data = await res.json();
                setProducts(data.posts);
                setLoading(false);
                if(data.posts.length===9){
                    setShowMore(true);
                }else{
                    setShowMore(false);
                }
            }

        }
        fetchProducts();
    } , [location.search]);

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
          setSideBarData({ ...sideBarData, searchTerm: e.target.value });
        }
        if (e.target.id === 'sort') {
          const order = e.target.value || 'desc';
          setSideBarData({ ...sideBarData, sort: order });
        }
        if (e.target.id === 'category') {
          const category = e.target.value || 'uncategorized';
          setSideBarData({ ...sideBarData, category });
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sideBarData.searchTerm);
        urlParams.set('sort', sideBarData.sort);
        urlParams.set('category', sideBarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
      };

  return (
    <div>
        <div className="">
            <form onSubmit={handleSubmit}>
                <div className="">
                    <label>Search Item:</label>
                    <TextInput placeholder="search..." id="searchTerm" type="text" value={sideBarData.searchTerm}  onChange={handleChange}/>
                </div>
            </form>
        </div>
    </div>
  )
}
