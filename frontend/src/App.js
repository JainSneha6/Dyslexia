import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/Homepage";
import DyslexiaScreeningTestsPage from "./pages/DyslexiaScreeningTest";
import KauffmanMemoryTest from './pages/KauffmanMemoryTest';
import Signup from './pages/Signup';
import Login from './pages/Login';
import GrayOralReadingTest from './pages/GrayOralReading';
import ReadingAssistanceTool from './pages/ReadingAssisstanceTool';
import WritingAssistant from './pages/WritingAssistant';
import DocumentSimplifier from './pages/DocumentSimplifier';
import MindMapGenerator from './pages/MindMapGenerator';
import DocumentSupport from './pages/DocumentSupport';
import CustomizedLearningPathsPage from './pages/CustomizedLearningPath';
import MildLearningPathPage from './pages/MildLearningPath';
import ModerateLearningPathPage from './pages/ModerateLearningPath';
import MemoryGame from './pages/MemoryGame';
import SevereLearningPathPage from './pages/SevereLearningPath';
import PhonologicalAwarenessAssistant from './pages/PhonologicalAssistant';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dyslexia-screening-tests" element={<DyslexiaScreeningTestsPage />} />
          <Route path="/kauffman-memory-test" element={<KauffmanMemoryTest />} />
          <Route path="/gray-oral-reading" element={<GrayOralReadingTest />} />
          <Route path="/reading-assistance" element={<ReadingAssistanceTool />} />
          <Route path="/writing-assistant" element={<WritingAssistant />} />
          <Route path="/document-simplifier" element={<DocumentSimplifier />} />
          <Route path='/mindmap-generator' element={<MindMapGenerator />} />
          <Route path='/document-support' element={<DocumentSupport />} />
          <Route path='/customized-learning-path' element={<CustomizedLearningPathsPage/>} />
          <Route path='/mild-learning-path' element={<MildLearningPathPage/>} />
          <Route path='/moderate-learning-path' element={<ModerateLearningPathPage/>} />
          <Route path='/severe-learning-path' element={<SevereLearningPathPage/>} />
          <Route path='/phonological-assistant' element={<PhonologicalAwarenessAssistant/>} />
          <Route path='/memory-game' element={<MemoryGame/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
