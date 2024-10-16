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
          <Route path='/mindmap-generator' element={<MindMapGenerator/>}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
