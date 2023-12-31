import { Link } from "react-router-dom";
import React from "react";
import { ProgressBar, Breadcrumb,Row,Col, Card } from "react-bootstrap";
export default function Services() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Services</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item"href="#">
              Pages
            </Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumb-item active breadcrumds" aria-current="page">
              Services
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
            <Link to="#" className="btn btn-primary btn-icon text-white me-3">
              <span>
                <i className="fe fe-plus"></i>&nbsp;
              </span>
              Add Account
            </Link>
            <Link to="#" className="btn btn-success btn-icon text-white">
              <span>
                <i className="fe fe-log-in"></i>&nbsp;
              </span>
              Export
            </Link>
          </div>
      </div>

      <Row>
        <Col xl={3} lg={6} md={12} sm={12}>
          <Card className="service">
            <Card.Body>
              <div className="item-box text-center">
                <div className=" text-center  mb-4 text-primary">
                  <i className="icon icon-people"></i>
                </div>
                <div className="item-box-wrap">
                  <h5 className="mb-2">Creative solutions</h5>
                  <p className="text-muted mb-0">
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={12} sm={12}>
          <Card className="service">
            <Card.Body>
              <div className="item-box text-center">
                <div className=" text-center text-danger-gradient mb-4">
                  <i className="icon icon-clock"></i>
                </div>
                <div className="item-box-wrap">
                  <h5 className="mb-2">Trace your time</h5>
                  <p className="text-muted mb-0">
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={12} sm={12}>
          <Card className="service">
            <Card.Body>
              <div className="item-box text-center">
                <div className=" text-center text-success mb-4">
                  <i className="fa fa-building-o"></i>
                </div>
                <div className="item-box-wrap">
                  <h5 className="mb-2">Business FrameWork</h5>
                  <p className="text-muted mb-0">
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={12} sm={12}>
          <Card className="service">
            <Card.Body>
              <div className="item-box text-center">
                <div className="text-center text-warning-gradient mb-4">
                  <i className="icon icon-action-redo"></i>
                </div>
                <div className="item-box-wrap">
                  <h5 className="mb-2">Shares</h5>
                  <p className="text-muted mb-0">
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} lg={6}>
          <Card>
            <Card.Body>
              <Row>
                <Col className="feature" xl={2} lg={3}>
                  <div className="fa-stack fa-lg fa-1x border btn-primary mb-3">
                    <i className="fa fa-globe fa-stack-1x text-white"></i>
                  </div>
                </Col>
                <Col lg={9} xl={10}>
                  <div className="mt-1">
                    <h4 className="fw-semibold">Web design</h4>
                    <p className="mb-0">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout. The point of using Lorem Ipsum is that it
                      has a more-or-less normal distribution of letters, as
                      opposed to using 'Content here, content here', making it
                      look like readable English.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={6}>
          <Card>
            <Card.Body>
              <Row>
                <Col className="feature" xl={2} lg={3}>
                  <div className="fa-stack fa-lg fa-1x border bg-warning mb-3">
                    <i className="fa fa-building-o fa-stack-1x text-white"></i>
                  </div>
                </Col>
                <Col lg={9} xl={10}>
                  <div className="mt-1">
                    <h4 className="fw-semibold">Web Development</h4>
                    <p className="mb-0">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout. The point of using Lorem Ipsum is that it
                      has a more-or-less normal distribution of letters, as
                      opposed to using 'Content here, content here', making it
                      look like readable English.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={6}>
          <Card>
            <Card.Body>
              <Row>
                <Col className="feature" xl={2} lg={3}>
                  <div className="fa-stack fa-lg fa-1x border bg-pink mb-3">
                    <i className="fa fa-file-word-o fa-stack-1x text-white"></i>
                  </div>
                </Col>
                <Col lg={9} xl={10}>
                  <div className="mt-1">
                    <h4 className="fw-semibold">Wordpress</h4>
                    <p className="mb-0">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout. The point of using Lorem Ipsum is that it
                      has a more-or-less normal distribution of letters, as
                      opposed to using 'Content here, content here', making it
                      look like readable English.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={6}>
          <Card>
            <Card.Body>
              <Row>
                <Col className="feature" xl={2} lg={3}>
                  <div className="fa-stack fa-lg fa-1x border bg-danger mb-3">
                    <i className="fa fa-camera fa-stack-1x text-white"></i>
                  </div>
                </Col>
                <Col lg={9} xl={10}>
                  <div className="mt-1">
                    <h4 className="fw-semibold">photography</h4>
                    <p className="mb-0">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout. The point of using Lorem Ipsum is that it
                      has a more-or-less normal distribution of letters, as
                      opposed to using 'Content here, content here', making it
                      look like readable English.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={6}>
          <Card>
            <Card.Body>
              <Row>
                <Col className="feature" xl={2} lg={3}>
                  <div className="fa-stack fa-lg fa-1x border bg-purple mb-3">
                    <i className="fa fa-pencil-square-o fa-stack-1x text-white"></i>
                  </div>
                </Col>
                <Col lg={9} xl={10}>
                  <div className="mt-1">
                    <h4 className="fw-semibold">Development</h4>
                    <p className="mb-0">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout. The point of using Lorem Ipsum is that it
                      has a more-or-less normal distribution of letters, as
                      opposed to using 'Content here, content here', making it
                      look like readable English.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={6}>
          <Card>
            <Card.Body>
              <Row>
                <Col className="feature" xl={2} lg={3}>
                  <div className="fa-stack fa-lg fa-1x border bg-success mb-3">
                    <i className="fa fa-eercast fa-stack-1x text-white"></i>
                  </div>
                </Col>
                <Col lg={9} xl={10}>
                  <div className="mt-1">
                    <h4 className="fw-semibold">Android</h4>
                    <p className="mb-0">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout. The point of using Lorem Ipsum is that it
                      has a more-or-less normal distribution of letters, as
                      opposed to using 'Content here, content here', making it
                      look like readable English.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Our services</h3>
            </Card.Header>
            <Card.Body>
              <div className="text-wrap">
                <p>
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which don't look
                  even slightly believable. If you are going to use a passage of
                  Lorem Ipsum, you need to be sure there isn't anything
                  embarrassing hidden in the middle of text
                </p>
                <Row className="mt-3">
                  <Col md={6}>
                    <label>Web Design</label>
                    <div className="progress progress-md mb-3">
                      <ProgressBar
                        className="progress-bar  w-50"
                        variant="purple"
                        label={`${50}%`}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <label>Web Development</label>
                    <div className="progress progress-md mb-3">
                      <ProgressBar
                        className="progress-bar  w-70"
                        variant="danger"
                        label={`${70}%`}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <label>Wordpress</label>
                    <div className="progress progress-md mb-3">
                      <ProgressBar
                        className="progress-bar  w-80"
                        variant="warning"
                        label={`${80}%`}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <label>Photography</label>
                    <div className="progress progress-md mb-3">
                      <ProgressBar
                        className="progress-bar  w-75"
                        variant="primary"
                        label={`${75}%`}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <label>Development</label>
                    <div className="progress progress-md mb-3 mb-md-0">
                      <ProgressBar
                        className="progress-bar  w-65"
                        variant="pink"
                        label={`${65}%`}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <label>Android</label>
                    <div className="progress progress-md mb-0">
                      <ProgressBar
                        className="progress-bar w-70"
                        variant="success"
                        label={`${70}%`}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
