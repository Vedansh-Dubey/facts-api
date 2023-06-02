import React from 'react';
import './documentationPage.css';
import { BackTop } from 'antd';

const DocumentationPage = () => {
    return (
        <div className="container">
            <h1 className="title">IT Facts API Documentation</h1>

            <section className="section">
                <h2 className="section-title">API Description</h2>
                <p>
                    The IT Facts API provides a collection of facts related to the IT world. Developers can use this API to retrieve random facts based on specified criteria such as quantity and tags.
                    Please note that this API is currently in development and may have bugs and errors within the data.
                </p>
            </section>

            <section className="section">
                <h2 className="section-title">Base URL</h2>
                <p>The base URL for the API is: <code>http://localhost:8080</code></p>
            </section>

            <section className="section">
                <h2 className="section-title">Authentication</h2>
                <p>To authenticate API requests, include the API key in the <code>x-api-key</code> header.</p>
                <pre>
                    <code>{`GET /api/facts\nx-api-key: {API_KEY}`}</code>
                </pre>
            </section>

            <section className="section">
                <h2 className="section-title">Error Handling</h2>
                <p>The API may return the following error responses:</p>
                <ul>
                    <li>
                        <strong>400 Bad Request:</strong> The request is invalid or missing required parameters. The response will include an error object with a corresponding message.
                    </li>
                    <li>
                        <strong>401 Unauthorized:</strong> The provided API key is invalid or not authorized to access the API.
                    </li>
                    <li>
                        <strong>403 Forbidden:</strong> The API usage quota has been exceeded.
                    </li>
                    <li>
                        <strong>500 Internal Server Error:</strong> An unexpected error occurred while processing the request.
                    </li>
                </ul>
            </section>

            <section className="section">
                <h2 className="section-title">Rate Limiting</h2>
                <p>The API has rate limiting in place to prevent abuse. Each user is limited to 100 requests per minute.</p>
                <p>If the rate limit is exceeded, the API will respond with a 429 status code and a message indicating that the rate limit has been exceeded. Please try again later.</p>
            </section>

            <section className="section">
                <h2 className="section-title">API Endpoints</h2>

                <section className="endpoint-section">
                    <h3 className="endpoint-title">Retrieve Random Facts</h3>
                    <pre>
                        <code>GET /api/facts</code>
                    </pre>

                    <p>
                        Retrieve a specified quantity of random facts based on the provided parameters.
                    </p>

                    <h4 className="parameter-title">Parameters</h4>
                    <table className="parameter-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Required</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>quant</td>
                                <td>number</td>
                                <td>Yes</td>
                                <td>The quantity of facts to retrieve.</td>
                            </tr>
                            <tr>
                                <td>tag</td>
                                <td>string</td>
                                <td>No</td>
                                <td>Filter facts based on the specified tag(s).</td>
                            </tr>
                        </tbody>
                    </table>

                    <h4 className="example-title">Example Request</h4>
                    <pre>
                        <code>{`GET /api/facts?quant=5&tag=technology,programming\nx-api-key: {API_KEY}`}</code>
                    </pre>

                    <h4 className="example-title">Example Response</h4>
                    <pre>
                        <code>{`HTTP/1.1 200 OK\nContent-Type: application/json\n\n[\n  {\n    "id": 84,\n    "fact": "Progressive web apps (PWAs) combine the features of both websites and mobile applications, providing an app-like experience within a web browser.",\n    "tags": ["WebDev"]\n  },\n  {\n    "id": 212,\n    "fact": "Japan has the fastest Internet speed of 319 terabits per second.",\n    "tags": ["FunFact"]\n  },\n  {\n    "id": 80,\n    "fact": "The IBM System/360, introduced in 1964, was a groundbreaking family of mainframe computers that offered a wide range of models and compatibility.",\n    "tags": ["ComputerHistory"]\n  },\n  {\n    "id": 55,\n    "fact": "Bootstrap is a popular CSS framework that helps in building responsive and mobile-friendly web interfaces.",\n    "tags": ["WebDev"]\n  },\n  {\n    "id": 46,\n    "fact": "Natural language processing (NLP) is a branch of AI that focuses on the interaction between computers and human language.",\n    "tags": ["AI"]\n  }\n]`}</code>
                    </pre>
                </section>

                <section className="endpoint-section">
                    <h3 className="endpoint-title">Error Responses</h3>

                    <h4 className="error-title">400 Bad Request</h4>
                    <pre>
                        <code>{`HTTP/1.1 400 Bad Request\nContent-Type: application/json\n\n{\n  "error": "The 'quant' parameter must be a positive integer."\n}`}</code>
                    </pre>

                    <h4 className="error-title">401 Unauthorized</h4>
                    <pre>
                        <code>{`HTTP/1.1 401 Unauthorized\nContent-Type: application/json\n\n{\n  "error": "Invalid API key"\n}`}</code>
                    </pre>

                    <h4 className="error-title">403 Forbidden</h4>
                    <pre>
                        <code>{`HTTP/1.1 403 Forbidden\nContent-Type: application/json\n\n{\n  "error": "Quota exceeded"\n}`}</code>
                    </pre>

                    <h4 className="error-title">500 Internal Server Error</h4>
                    <pre>
                        <code>{`HTTP/1.1 500 Internal Server Error\nContent-Type: application/json\n\n{\n  "error": "Failed to verify quota"\n}`}</code>
                    </pre>
                </section>
            </section>

            <section className="section">
                <h2 className="section-title">Tags and Facts Availability</h2>
                <p>For each tag listed below, there are currently a maximum of 20 facts available. Please note that some facts may be repeated.</p>
                <ul>
                    <li>ComputerHistory</li>
                    <li>FunFact</li>
                    <li>DataScience</li>
                    <li>Internet</li>
                    <li>Blockchain</li>
                    <li>AI</li>
                    <li>WebDev</li>
                    <li>Cybersecurity</li>
                    <li>OperatingSystems</li>
                    <li>ProgrammingLanguages</li>
                </ul>
            </section>

            <section className="section">
                <h2 className="section-title">Authorization and API Keys</h2>
                <p>
                    Manage, generate, and monitor your API key usage statistics effortlessly using our User API Dashboard. Simply log in with your mobile number and complete the OTP validation process. The dashboard supports multiple API keys for different purposes. Please note that all your API keys share a common quota of 1000 calls per user. If you need a higher quota, please reach out to us through the provided contact section.<br /> Please note that all of your API keys share a common quota of 1000 calls per user. If you require a higher quota, please contact us through the provided contact section.</p>
                <br />
                <ul>
                    <li>
                        <a href="https://www.google.com/">API Dashboard</a> - Required for authentication and quota verification.
                    </li>
                </ul>
                <pre style={{ color: "red" }}>
                    Make sure you logout after you are done with the dashboard
                </pre>
                <p style={{ paddingTop: "10px" }}>To minimize OTP requests on our development package, the session duration has been extended to 2 hours. <b style={{color:"red"}}>If you close the tab or navigate away, you'll remain logged in until you manually log out of the session.</b> After 2 hours of inactivity, the system will automatically log you out for security. This approach balances user experience and security by preventing indefinite session persistence.</p>

               <p> Only 10 users can sign in per day, so if you are facing an error getting the OTP, please try sometime later or the next day.</p>
            </section>

            <section className="section">
                <h2 className="section-title">Changelog</h2>
                <h3 className="changelog-version">Version 1.0.0 (June 1, 2023)</h3>
                <ul>
                    <li>Initial release of the IT Facts API.</li>
                </ul>
            </section>

            <section className="section">
                <h2 className="section-title">Disclaimer</h2>
                <p>
                    Please note that this API is not ready for production use and may have bugs and errors or some security flaws within the API & data. Use it at your own risk.
                </p>
            </section>

            <section className="section">
                <h2 className="section-title">Contact</h2>
                <p>
                    For further assistance or inquiries, please contact our support team at <a href="mailto:dubey.vedansh.14@gmail.com">support@itfacts.api.com</a>.
                </p>
            </section>
            <BackTop />
        </div>
    );
};

export default DocumentationPage;


