import { useState } from "react";
import Banner from "../../components/Homepage/Banner";
import AllBooks from "../../components/Homepage/AllBooks";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <Banner onSearch={(query) => setSearchQuery(query)} searchQuery={searchQuery} />
      <AllBooks externalSearch={searchQuery} />
    </div>
  );
};

export default Homepage;
