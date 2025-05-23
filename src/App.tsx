import './App.css'
import DocumentManagementApp from "./DocumentManagementApp.tsx";
import './index.css'
const TestComponent = () => {
    return (
        <div className="p-4 m-4 bg-blue-500 text-white rounded">
            This should be a blue box with white text and rounded corners
        </div>
    );
};
function App() {

  return (
      <>
          <DocumentManagementApp/>
      </>
  )
}

export default App
