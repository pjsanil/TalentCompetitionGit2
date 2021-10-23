import React from "react";
import { Menu } from "semantic-ui-react";
const Pagination = (props) => {
  const pageNumbers = [];
  const { postsPerPage, totalPosts, paginate } = props;
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav>
      <Menu floated="right" pagination className="paginate">
        {pageNumbers.map((number) => (
          <Menu.Item
            as="a"
            key={number}
            onClick={() => paginate(number)}
            style={{            
              borderLeft: "2px solid #38A9E3",
              hoverColor: "#495054",
            }}
          >
            {number}
          </Menu.Item>
        ))}
      </Menu>
    </nav>
  );
};
export default Pagination;