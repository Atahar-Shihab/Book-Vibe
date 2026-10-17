

const Banner = () => {
    return (

            <div className="hero bg-base-200 min-h-[70vh] my-8 rounded-2xl container mx-auto">
  <div className="hero-content flex-col lg:flex-row-reverse w-full justify-between">
    <img
      alt="Tailwind CSS hero component" className="max-w-sm rounded-lg shadow-4xl"
      src="../assets/pngwing 1.png"
    />  
    <div>
      <h1 className="text-5xl font-bold">Books to freshen up <br /> your bookshelf</h1>
      <button className="btn rounded-2xl mt-5 text-white bg-[#23BE0A]">View The List</button>
    </div>
  </div>
</div>
    
    );
};

export default Banner;