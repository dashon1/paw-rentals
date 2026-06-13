import Layout from "./Layout.jsx";

import Search from "./Search";

import PropertyDetails from "./PropertyDetails";

import Favorites from "./Favorites";

import PostListing from "./PostListing";

import Account from "./Account";

import Reviews from "./Reviews";

import Messages from "./Messages";

import PetProfiles from "./PetProfiles";

import Applications from "./Applications";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Search: Search,
    
    PropertyDetails: PropertyDetails,
    
    Favorites: Favorites,
    
    PostListing: PostListing,
    
    Account: Account,
    
    Reviews: Reviews,
    
    Messages: Messages,
    
    PetProfiles: PetProfiles,
    
    Applications: Applications,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Search />} />
                
                
                <Route path="/Search" element={<Search />} />
                
                <Route path="/PropertyDetails" element={<PropertyDetails />} />
                
                <Route path="/Favorites" element={<Favorites />} />
                
                <Route path="/PostListing" element={<PostListing />} />
                
                <Route path="/Account" element={<Account />} />
                
                <Route path="/Reviews" element={<Reviews />} />
                
                <Route path="/Messages" element={<Messages />} />
                
                <Route path="/PetProfiles" element={<PetProfiles />} />
                
                <Route path="/Applications" element={<Applications />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}