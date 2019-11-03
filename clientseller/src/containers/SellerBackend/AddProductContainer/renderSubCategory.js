const renderSub = value => {
  switch (value) {
    case "Agriculture & Food":
      return [
        {
          value: "",
          displayValue: "--Select Subcategory--"
        },

        {
          value: "Agriculture",
          displayValue: "Agriculture"
        },
        {
          value: "Food & Beverage",
          displayValue: "Food & Beverage"
        }
      ];
    case "Apparel Textiles & Accessories":
      return [
        {
          value: "",
          displayValue: "--Select Subcategory--"
        },
        {
          value: "Fashion Accessories",
          displayValue: "Fashion Accessories"
        },
        {
          value: "Timepieces, Jewelry, Eyewear",
          displayValue: "Timepieces, Jewelry, Eyewear"
        }
      ];

    case "Auto & Transportation":
      return [
        {
          value: "",
          displayValue: "--Select Subcategory--"
        },
        {
          value: "Vehicles & Accessories",
          displayValue: "Vehicles & Accessories"
        }
      ];
    case "Bags, Shoes & Accessories":
      return [
        {
          value: "",
          displayValue: "--Select Subcategory--"
        },
        {
          value: "Luggage, Bags & Cases",
          displayValue: "Luggage, Bags & Cases"
        },
        {
          value: "Shoes & Accesories",
          displayValue: "Shoes & Accesories"
        }
      ];
    case "Electronics":
      return [
        {
          value: "",
          displayValue: "--Select Subcategory--"
        },
        {
          value: "Consumer Electronic",
          displayValue: "Consumer Electronic"
        },
        {
          value: "Home Appliance",
          displayValue: "Home Appliance"
        },
        {
          value: "Security & Protection",
          displayValue: "Security & Protection"
        }
      ];
    case "Electrical Equipment, Components & Telecoms":
      return [
        {
          value: "",
          displayValue: "--Select Subcategory--"
        },
        {
          value: "Electrical Equipment & Supplies",
          displayValue: "Electrical Equipment & Supplies"
        },
        {
          value: "Telecommunication",
          displayValue: "Telecommunication"
        }
      ];
    case "Gifts Sports & Toys":
      return [
        {
          value: "",
          displayValue: "--Select Subcategory--"
        },
        {
          value: "Sports & Entertainment",
          displayValue: "Sports & Entertainment"
        },
        {
          value: "Gifts & Crafts",
          displayValue: "Gifts & Crafts"
        },
        {
          value: "Toys & Hobbies",
          displayValue: "Toys & Hobbies"
        }
      ];
    case "Health & Beauty":
      return [
        {
          value: "",
          displayValue: "--Select Subcategory--"
        },
        {
          value: "Health & Medical",
          displayValue: "Health & Medical"
        },
        {
          value: "Beauty & Personal Care",
          displayValue: "Beauty & Personal Care"
        }
      ];
    case "Home, Lights & Construction":
      return [
        {
          value: "",
          displayValue: "--Select Subcategory--"
        },
        {
          value: "Construction & Real Estate",
          displayValue: "Construction & Real Estate"
        },
        {
          value: "Home & Garden",
          displayValue: "Home & Garden"
        },
        {
          value: "Lights & Lighting",
          displayValue: "Lights & Lighting"
        },
        {
          value: "Furniture",
          displayValue: "Furniture"
        }
      ];
    case "Machinery, Industrial Parts & Tools":
      return [
        {
          value: "",
          displayValue: "--Select Subcategory--"
        },
        {
          value: "Machinery",
          displayValue: "Machinery"
        },
        {
          value: "Fabrication Services",
          displayValue: "Fabrication Services"
        },
        {
          value: "Tools & Hardware",
          displayValue: "Tools & Hardware"
        }
      ];
    case "Metallurgy, Chemicals, Rubber & Plastics":
      return [
        {
          value: "",
          displayValue: "--Select Subcategory--"
        },
        {
          value: "Minerals & Metallurgy",
          displayValue: "Minerals & Metallurgy"
        },
        {
          value: "Chemicals",
          displayValue: "Chemicals"
        },
        {
          value: "Rubber & Plastics",
          displayValue: "Rubber & Plastics"
        },
        {
          value: "Energy",
          displayValue: "Energy"
        }
      ];
    case "Packaging & Advertising Services":
      return [
        {
          value: "",
          displayValue: "--Select Subcategory--"
        },
        {
          value: "Packaging and Printing",
          displayValue: "Packaging and Printing"
        },
        {
          value: "Office & School Supplies",
          displayValue: "Office & School Supplies"
        },
        {
          value: "Service Equipment",
          displayValue: "Service Equipment"
        }
      ];
    default:
      return [{ value: "", displayValue: "" }];
  }
};

export default renderSub;
