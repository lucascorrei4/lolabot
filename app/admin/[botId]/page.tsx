import { listSignals } from '../../../lib/db/mongo';
import SignalsDashboard from './SignalsDashboard';

export default async function AdminSignalsPage({ params }: { params: Promise<{ botId: string }> }) {
    const { botId } = await params;

    // Fetch latest signals
    const rawSignals = await listSignals(botId, 50);

    // Serialize data (convert ObjectId and Dates to strings) to pass to client component
    const signals = JSON.parse(JSON.stringify(rawSignals));

    return <SignalsDashboard botId={botId} signals={signals} />;
}
