import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import {
  CardBody,
  Col,
  Row,
  Container,
  Spinner,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import {URL, columns} from '../../constants/index'
import "./home.css";

function HomePage() {
const [responsive] = useState("vertical");
const [tableBodyHeight] = useState("400px");
const [tableBodyMaxHeight] = useState("");
const[rowsPerPage,setRowsPerPage] = useState(10);
const [value, setValue] = useState([]);
const [favorite, setFavorite] = useState([]);
const [visible, setVisible] = useState(true);
const [lastClicked, setLastClicked] = useState('Bangalore');
const[offset, setOffset] = useState(0);
const [dropdownOpen, setDropdownOpen] = useState(false);

const toggle = () => setDropdownOpen((prevState) => !prevState);
 
  const options = {
    filter: true,
    filterType: "dropdown",
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
    rowsPerPageOptions: [5, 10, 15, 20, 25, 30 ],
    count: 12787,
    print: false,
    jumpToPage: true,
    changePage: false,
    rowsPerPage: rowsPerPage,
    onChangeRowsPerPage:  (numberOfRows) => {
    setRowsPerPage(numberOfRows) },
    onChangePage: (currentPage) => {
      setOffset(currentPage*rowsPerPage)
    },
    onRowClick: async(rowData, rowState) => {
      let perFavourite = JSON.parse(localStorage.getItem("favourites") || "[]")
      if(perFavourite.includes(rowData[0]))
      {
      perFavourite = perFavourite.filter(function(element){ 
        return element !== rowData[0]; 
    });
  }
  else{
    perFavourite.push(rowData[0]);
  }
  let temporaryVariable = value
  setFavorite(perFavourite)
  let temporary = await favoritePending(temporaryVariable)
  setValue(temporary)
      localStorage.setItem("favourites",JSON.stringify(perFavourite))
    },    
  };

  useEffect(() => {
    setVisible(true)
    getData(URL+"api/branches?q="+lastClicked+"&limit="+rowsPerPage+"&offset="+offset)
    .then(function (response) {
      let favouriteVariable = JSON.parse(localStorage.getItem("favourites") || "[]")
      for(let i=0;i<response.branches.length;i++){
        if(favouriteVariable.includes(response.branches[i].ifsc))
        {
          response.branches[i].favorite = "Added to Favourite"
        }
        else{        
          response.branches[i].favorite = "Add to Favourite"
        }
      }
      setValue(response.branches)
      setVisible(false)
    })
    .catch(error => {
        setVisible(false)
    });
  }, [offset, rowsPerPage, lastClicked]); 

const favoritePending = async (temporaryVariable)=>{
  for (let i=0;i<temporaryVariable.length;i++){
    if(favorite.includes(temporaryVariable[i].ifsc))
    {
      temporaryVariable[i].favorite = "Added to Favourite"
    }
    else{
      temporaryVariable[i].favorite = "Add to Favouritre"
    }
  }
  return await temporaryVariable;
}
  const getData = async (url) =>{
    const cacheName = 'workbox-runtime-' + window.location.origin + "/";
    let cachedData = await getCachedData(cacheName, url);
    if (cachedData) {
      return cachedData.json();
    }  
    const cacheStorage = await caches.open(cacheName);
    await cacheStorage.add(url);
    cachedData = await getCachedData(cacheName, url);
    await deleteOldCaches(cacheName);
    return await cachedData.json();
  }

  const getCachedData = async(cacheName, url) => {
    const cacheStorage = await caches.open(cacheName);
    const cachedResponse = await cacheStorage.match(url);
    if (!cachedResponse || !cachedResponse.ok) {
      return false;
    }
    return await cachedResponse;
  }

  const deleteOldCaches = async (currentCache)=> {
    const keys = await caches.keys();
    for (const key of keys) {
      const isOurCache = 'myapp-' === key.substr(0, 6);
      if (currentCache === key || !isOurCache) {
        continue;
      }
      caches.delete(key);
    }
  }

  return (
    <div>
      <Container>
      {visible ? (
              <Spinner color="primary" type="grow" className="spinner" />
        ) : (
          <Row>
            <Col
              xl={10}
              lg={0}
              md={10}
              sm={12}
              className = "mainCard"
            >
              <center>
                <h3 className= "bankBranches">Bank Branches</h3>
              </center>
              <CardBody>
                <center>
                <Row className = "rowCard">
                  <Col xl={12} lg={12} md={12} >
                    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                      <DropdownToggle caret>Select Branch</DropdownToggle>
                      <DropdownMenu container="body">
                        <DropdownItem
                          onClick={() => setLastClicked("Bangalore")}
                        >
                          Bangalore
                        </DropdownItem>
                        <DropdownItem onClick={() => setLastClicked("Mumbai")}>
                          Mumbai
                        </DropdownItem>
                        <DropdownItem onClick={() => setLastClicked("Pune")}>
                          Pune
                        </DropdownItem>
                        <DropdownItem onClick={() => setLastClicked("Kolkata")}>
                          Kolkata
                        </DropdownItem>
                        <DropdownItem onClick={() => setLastClicked("Delhi")}>
                          Delhi
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <div  className="clicked">
                    Selected Branch: {lastClicked || "Bangalore"}
                    </div>
                  </Col>
                </Row>
                </center>                
      <MUIDataTable
        title={"Bank Branch List"}
        data={value}
        columns={columns}
        options={options}
      />               
              </CardBody>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default HomePage;
