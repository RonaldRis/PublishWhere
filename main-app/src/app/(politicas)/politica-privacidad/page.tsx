import { Footer } from "@components/footer";
import Link from "next/link";

function PoliticaPrivacidadPage() {
    return (

        <div className="container m-4">
            <h1>Privacy Policy</h1>
            <p>Last Revision: 11-May-2024</p>
            <p><strong>PublishWhere</strong> is committed to strong, secure, and transparent privacy practices.</p>
            <p>We strive to protect your privacy and prevent any misuse or abuse of your personal data. Because we value your privacy and aim for our services to be safe and enjoyable for all:</p>
            <ul className="list-disc px-8">
                <li>We never sell personal data to anyone.</li>
                <li>We ensure all processing operations comply strictly with European privacy laws.</li>
                <li>You control your personal information at all times.</li>
            </ul>
            <p>Our Privacy Policy explains:</p>
            <ul className="list-disc px-8">
                <li>What information we collect and why we collect it.</li>
                <li>How we use, share, and protect this information.</li>
            </ul>
            <p>This Privacy Policy applies to:</p>
            <ul className="list-disc px-8">
                <li>Our Customers, including their internal users (“Customer Users”).</li>
                <li>End-Users (“End-Users”) of our Customers who interact with our Customers on their Social Profiles on Supported Platforms.</li>
            </ul>
            <p>This policy should be read in conjunction with the privacy policy of our Customers, which contains further details regarding the processing of your Personal Data by the Customer, and the privacy policy of the Supported Platform(s).</p>
            <p>If you have questions or complaints about our privacy policy or practices, please contact us at <a className="underline text-blue-500" href="mailto:legal@publishwhere.com">legal@publishwhere.com</a>.</p>

            <h2>1. Who is PublishWhere?</h2>
            <p><strong>PublishWhere</strong> is a European company based in Murcia, Spain. Founded in 2024, PublishWhere offers a software platform ("Service") that helps businesses and agencies manage their Social Profiles.</p>
            <p>The Service consolidates social media management, enabling Customers to manage messages, comments, content scheduling, and analysis of results across their Social Profiles, as well as monitor conversations on Supported Platforms using selected keywords.</p>
            <p>PublishWhere adheres to the French Data Privacy law, encompassing all relevant EU Data Protection Laws.</p>

            <h2>2. Information We Collect and Process</h2>
            <h3>2.1 Customer Personal Data</h3>
            <p>We collect data about our Customers and Customer Users such as:</p>
            <ul className="list-disc px-8">
                <li>Full name</li>
                <li>Email address</li>
                <li>Company name and contact details</li>
                <li>Social Profile URLs</li>
                <li>Content published on connected Social Profiles</li>
                <li>Data from your device, including activities on our Service, hardware and software information, and data from cookies.</li>
            </ul>
            <p>We use Customer Personal Data to:</p>
            <ul className="list-disc px-8">
                <li>Identify you when you login.</li>
                <li>Operate and provide the Service.</li>
                <li>Secure and authenticate your transactions.</li>
                <li>Analyze our Service and improve our offerings.</li>
                <li>Contact you about your account and respond to your inquiries.</li>
                <li>Market and communicate about our Service.</li>
            </ul>
            <h3>2.2 Customer Content</h3>
            <p>Our Customers control the content collected and used through the Service, including:</p>
            <ul className="list-disc px-8">
                <li>Posts, messages, comments, and images on Supported Platforms.</li>
                <li>Publicly available content that contains specific keywords.</li>
            </ul>
            <p>This content is used to:</p>
            <ul className="list-disc px-8">
                <li>Identify authors of messages.</li>
                <li>Aggregate user interactions for our Customers.</li>
            </ul>

            <h2>3. Third-Party Apps and Social Networks</h2>
            <p>Content sent to Supported Platforms is governed by their respective privacy policies once it leaves our Service.</p>
            <p>We encourage you to review the privacy policies of any Supported Platform you use:</p>
            <ul className="list-disc px-8">
                <li><a className="underline text-blue-500" target="_blank" href="https://www.facebook.com/policy.php">Facebook</a></li>
                <li><a className="underline text-blue-500" target="_blank" href="https://twitter.com/privacy">Twitter</a></li>
                <li><a className="underline text-blue-500" target="_blank" href="https://help.instagram.com/402411646841720">Instagram</a></li>
                <li><a className="underline text-blue-500" target="_blank" href="https://www.linkedin.com/legal/privacy-policy">LinkedIn</a></li>
                <li><a className="underline text-blue-500" target="_blank" href="https://www.youtube.com/yt/about/policies/#community-guidelines">YouTube</a></li>
                <li><a className="underline text-blue-500" target="_blank" href="http://www.google.com/policies/privacy">Google</a></li>
            </ul>
            <p>To disconnect from Supported Platforms:</p>
            <ul className="list-disc px-8">
                <li><a className="underline text-blue-500" target="_blank" href="https://security.google.com/settings/security/permissions">YouTube</a></li>
                <li><a className="underline text-blue-500" target="_blank" href="https://help.twitter.com/en/managing-your-account/connect-or-revoke-access-to-third-party-apps">Twitter</a></li>
                <li><a className="underline text-blue-500" target="_blank" href="https://www.facebook.com/help/204306713029340">Facebook & Instagram</a></li>
                <li><a className="underline text-blue-500" target="_blank" href="https://www.linkedin.com/pulse/remove-third-party-apps-connected-your-linkedin-hector-rodriguez/">LinkedIn</a></li>
            </ul>

            <h2>4. Cookies and Related Technologies</h2>
            <p>We use cookies to enhance your experience, analyze our traffic, and improve our Service. You can manage cookie settings in your browser.</p>

            <h2>5. Data Security</h2>
            <p>We implement best practices to secure your information, though no system can be completely secure. We limit access to personal information to authorized employees and vendors.</p>

            <h2>6. Your Rights</h2>
            <p>You have the right to access, modify, or delete your personal data. Email <a className="underline text-blue-500" href="mailto:legal@publishwhere.com">legal@publishwhere.com</a> to request changes.</p>

            <h2>7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. The latest version will be available at <Link className="underline text-blue-500" href="/politica-privacidad">PublishWhere Privacy Policy</Link>.</p>
            <p><strong>Consent:</strong> By using the Service, you consent to the collection and use of your information as described.</p>
            <p><strong>Governing Law:</strong> This Privacy Policy is part of our Terms of Service, governed by [Jurisdiction] law.</p>

            <p>For detailed definitions and further information, please visit our Terms of Service at <Link className="underline text-blue-500" href="/terminos-servicio">PublishWhere Terms of Service</Link>.</p>

            <Footer />
        </div>

    );
}

export default PoliticaPrivacidadPage;