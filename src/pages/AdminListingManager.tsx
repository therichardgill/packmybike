import React from 'react';
import { ShoppingBag } from 'lucide-react';
import ListingManagement from '../components/ListingManagement';
import Collapsible from '../components/Collapsible';

function AdminListingManager() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Collapsible
        title={
          <div>
            <h2 className="text-2xl font-bold text-white">Listing Management</h2>
            <p className="text-gray-400">Manage bike bag listings and availability</p>
          </div>
        }
        icon={<ShoppingBag className="w-8 h-8 text-orange-500" />}
      >
        <ListingManagement />
      </Collapsible>
    </div>
  );
}

export default AdminListingManager;