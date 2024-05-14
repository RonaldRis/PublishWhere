import { Footer } from "@/components/footer";
import Link from "next/link";

export default function TerminosServicioPage() {

    return (
        <div className="container m-4">
            <h1>PublishWhere Terms of Service</h1>
            <p>Last Revision: November, 2023</p>
            <p>These PublishWhere terms of service (“Terms of Service”) are entered into by and between PublishWhere (“PublishWhere,” “us,” “we” or “our”) and our customer (“Customer,” “you,” or “your”).</p>
            <p>Please read these Terms of Service carefully.</p>

            <h2>1. General Provisions</h2>
            <p>PublishWhere offers a Software-as-a-Service (SaaS) that helps businesses and agencies manage their social media profiles on Supported Platforms (the “Service” as defined below). By using the Service, you agree to be bound by these Terms of Service. If you do not accept these Terms of Service you shall not (and shall not have the right to) use the Service.</p>
            <p>We reserve the right, at any time, to update and change any or all of these Terms of Service, in our sole discretion. If we do so, we will post the modified Terms of Service on <a className="underline text-blue-500" href="https://www.publishwhere.com">www.publishwhere.com</a>, though we will notify you of any changes. Continued use of the Service after any such changes have been made shall constitute your consent to such changes. If a change has a material adverse impact on you, and you have contracted and prepaid for a certain term, you may notify us within thirty (30) calendar days after being informed of that change that you do not agree with the change. If you do so, we will delay applying the change to you until your prepaid term ends. If you use the Service after your prepaid term ends, all changes will apply to you. You are responsible for regularly reviewing the most current version of these Terms of Service, which are currently available at: <a className="underline text-blue-500" href="https://www.publishwhere.com/terms-of-service">https://www.publishwhere.com/terms-of-service</a>.</p>

            <h2>2. Definitions</h2>
            <p>Several key terms are used in this document, which are defined as follows:</p>
            <ul className="list-disc px-8">
                <li><strong>Account:</strong> shall mean an account to use the Service;</li>
                <li><strong>Agreement:</strong> shall mean by order of precedence, the Data Protection Agreement you may ask at <a className="underline text-blue-500" href="mailto:legal@publishwhere.com">legal@publishwhere.com</a>, these Terms of Service and any annexes thereto which form an integral part thereof and which in their totality, govern your relationship with PublishWhere;</li>
                <li><strong>Applicable Law:</strong> shall mean the laws of France;</li>
                <li><strong>Authorized User:</strong> shall mean individuals who are authorized to access the Service under the Customer’s account;</li>
                <li><strong>Confidential Information:</strong> shall mean all information provided by you or us, to the other party, whether orally or in writing.</li>
            </ul>

            <h2>3. Account Registration, Access, and Disclosure</h2>
            <p>To use the Service, you must create an Account by completing a registration form and providing all required information. You agree to maintain the accuracy of this information and to keep your Account secure.</p>

            <h2>4. Subscription and Service</h2>
            <p>Your access to the Service is contingent upon the Subscription Plan you choose. We provide Updates and maintenance as part of the Service without additional charge.</p>

            <h2>5. Financial Conditions</h2>
            <p>All fees related to the Service are set forth on our Site and are exclusive of VAT and other applicable taxes.</p>

            <h2>6. Duration</h2>
            <p>The Service is offered both as a free trial and a paid subscription. Details regarding the duration of these terms are provided during the Account creation process.</p>

            <h2>7. Limited Licence</h2>
            <p>PublishWhere grants you a limited, revocable, non-exclusive license to use the Service provided you comply with the terms outlined herein.</p>

            <h2>8. Proprietary Rights</h2>
            <p>All rights, title, and interest in the Service and its content are owned by PublishWhere, except for content provided by users, which remains their own property.</p>

            <h2>9. Liability</h2>
            <p>PublishWhere’s liability is limited by the terms provided herein, particularly in relation to the nature of the Service and its use.</p>

            <h2>10. Confidential Information</h2>
            <p>Both parties agree to maintain the confidentiality of the information shared under this Agreement, with certain exceptions as provided by law.</p>

            <h2>14. Privacy / Data Protection</h2>
            <p>We process personal data in accordance with our <Link className="underline text-blue-500" href="/politica-privacidad">Privacy Policy</Link>.</p>

            <p>Contact Information:</p>
            <address>
                PublishWhere SAS<br />
                Calle greco 2, 30001 Murcia, Spain<br />
                Email: <a href="mailto:legal@publishwhere.com">legal@publishwhere.com</a>
            </address>

            <Footer />

        </div>

    )

}
