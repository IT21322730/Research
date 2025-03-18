import { useLocation } from "react-router-dom";

interface LocationState {
    prakrutiResult?: {
        final_prakriti: string;
        individual_predictions: {
            Eye: string;
            Face: string;
            Hair: string;
            Nails: string;
            Questionnaire: string;
        };
        message: string;
    };
}

const FinalPrakurthiAfterQuestionnaire: React.FC = () => {
    const location = useLocation<LocationState>();
    const prakrutiData = location.state?.prakrutiResult || null;

    if (!prakrutiData) {
        return <h2>No data available. Please submit the questionnaire first.</h2>;
    }

    return (
        <div>
            <h1>Final Prakriti Result</h1>
            <h2>Your Final Prakriti: {prakrutiData.final_prakriti}</h2>
            <h3>Component Predictions:</h3>
            <ul>
                <li>Eye: {prakrutiData.individual_predictions.Eye}</li>
                <li>Face: {prakrutiData.individual_predictions.Face}</li>
                <li>Hair: {prakrutiData.individual_predictions.Hair}</li>
                <li>Nails: {prakrutiData.individual_predictions.Nails}</li>
                <li>Questionnaire: {prakrutiData.individual_predictions.Questionnaire}</li>
            </ul>
            <p>{prakrutiData.message}</p>
        </div>
    );
};

export default FinalPrakurthiAfterQuestionnaire;
