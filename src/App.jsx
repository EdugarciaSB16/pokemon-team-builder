import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Home from '@/app/Home';
import Battle from '@/app/Battle';
import NotificationProvider from '@/components/NotificationProvider';

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <NotificationProvider />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </BrowserRouter>
    </DndProvider>
  );
}
