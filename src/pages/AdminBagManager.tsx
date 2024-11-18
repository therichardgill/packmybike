import React from 'react';
import { Building2, Package } from 'lucide-react';
import BrandManagement from '../components/BrandManagement';
import BagManagement from '../components/BagManagement';
import Collapsible from '../components/Collapsible';

function AdminBagManager() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Collapsible
        title={
          <div>
            <h2 className="text-2xl font-bold text-white">Bag Management</h2>
            <p className="text-gray-400">Manage bike bag specifications and details</p>
          </div>
        }
        icon={<Package className="w-8 h-8 text-blue-500" />}
      >
        <BagManagement />
      </Collapsible>
      
      <Collapsible
        title={
          <div>
            <h2 className="text-2xl font-bold text-white">Brand Management</h2>
            <p className="text-gray-400">Manage bike bag manufacturers</p>
          </div>
        }
        icon={<Building2 className="w-8 h-8 text-purple-500" />}
      >
        <BrandManagement />
      </Collapsible>
    </div>
  );
}

export default AdminBagManager;