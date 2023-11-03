import React from 'react';
import { Row, Col } from "react-bootstrap"
const Footer = () => {

	const currentYear = new Date().getFullYear();

	return (
		<div className="footer">
			<div className="container">
				<Row className="align-items-center flex-row-reverse">
					<Col className="text-center" sm={12} md={12} lg={12}>
						Copyright © {currentYear} Credentia. All rights reserved
					</Col>
				</Row>
			</div>
		</div>

	);
}

export default Footer;
