import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const CommonSidebar = (props) => {
  const { title, sidebarContent, visible, onClose } = props;

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatKey = (key) => {
    const words = key.split(/[ _]/);
    const formattedWords = words.map((word) => capitalizeFirstLetter(word));
    return formattedWords.join(" ");
  };

  return (
    <div className={`common-sidebar ${visible ? "visible" : ""}`}>
      <div className="card">
        <div className="card-header text-center SidebarSearchheader">
          <h3 className="SidebarSearch-title m-0">{title}</h3>
          <button className="close-button" onClick={props.onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="card-body scrollview">
          {sidebarContent ? (
            <div style={{ display: "flex", width: "100%" }}>
              <ul
                style={{
                  listStyleType: "none",
                  padding: 0,
                  marginRight: "10px",
                  width: "60%",
                }}
              >
                {Object.keys(sidebarContent)
                  .filter(
                    (key) =>
                      ![
                        "unique_id",
                        "business_type_id",
                        "id",
                        "business_sub_type_id",
                        "supplier_id",
                        "data_import_type_id",
                        "clients",
                        "client_id",
                        "company_id",
                      ].includes(key)
                  )
                  .slice(0, Math.ceil(Object.keys(sidebarContent).length / 2))
                  .map((key) => (
                    <li key={key} className="li-row">
                      <strong>{formatKey(key)}</strong>
                      <br /> {sidebarContent[key]}
                    </li>
                  ))}
              </ul>
              <ul style={{ listStyleType: "none", padding: 0, width: "50%" }}>
                {Object.keys(sidebarContent)
                  .filter(
                    (key) =>
                      ![
                        "unique_id",
                        "business_type_id",
                        "id",
                        "business_sub_type_id",
                        "supplier_id",
                        "data_import_type_id",
                        "clients",
                      ].includes(key)
                  )
                  .slice(Math.ceil(Object.keys(sidebarContent).length / 2))
                  .map((key) => (
                    <li key={key} className="li-row">
                      <strong>{formatKey(key)}</strong>
                      <br /> {sidebarContent[key]}
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <p>No sidebar content available</p>
          )}
        </div>
      </div>
    </div>
  );
};

CommonSidebar.propTypes = {
  title: PropTypes.string.isRequired,
  sidebarContent: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CommonSidebar;
