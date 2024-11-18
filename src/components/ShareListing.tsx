import React, { useState } from 'react';
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle, Link as LinkIcon } from 'lucide-react';
import type { Listing } from '../types';

interface ShareListingProps {
  listing: Listing;
}

const ShareListing: React.FC<ShareListingProps> = ({ listing }) => {
  const [copied, setCopied] = useState(false);
  const shortUrl = listing.shortUrl;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shortUrl)}&text=${encodeURIComponent(`Check out this bike bag rental: ${listing.bagSpecs.model}`)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out this bike bag rental: ${listing.bagSpecs.model} ${shortUrl}`)}`,
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center space-x-2">
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition duration-200"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {copied ? 'Copied!' : 'Copy Link'}
          </span>
        </button>

        <div className="flex items-center space-x-2">
          <a
            href={shareUrls.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition duration-200"
            title="Share on Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href={shareUrls.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-lg transition duration-200"
            title="Share on Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href={shareUrls.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition duration-200"
            title="Share on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2">
          <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={shortUrl}
            readOnly
            className="bg-transparent text-sm text-gray-300 focus:outline-none flex-1 min-w-0"
          />
        </div>
      </div>
    </div>
  );
};

export default ShareListing;