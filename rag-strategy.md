# RAG Strategy for Obfusi-Bob
## Research Paper Ingestion & Query System

---

## 🎯 Overview

The RAG (Retrieval-Augmented Generation) system enables Bob to access cutting-edge obfuscation research and make informed transformation decisions based on academic literature. This system ingests research papers, creates embeddings, and provides contextual recommendations for obfuscation techniques.

```mermaid
graph LR
    A[Research Papers] --> B[Document Processor]
    B --> C[Text Extraction]
    C --> D[Chunking]
    D --> E[watsonx.ai Embeddings]
    E --> F[Vector Database]
    
    G[Bob Query] --> H[Query Embedding]
    H --> I[Hybrid Search]
    I --> F
    F --> J[Top-K Results]
    J --> K[watsonx.ai LLM]
    K --> L[Contextualized Response]
    
    style E fill:#4AE290
    style K fill:#4AE290
    style F fill:#FFD700
```

---

## 📚 Recommended Research Papers

### Core Obfuscation Techniques

#### 1. Control Flow Flattening
- **"Obfuscating C++ Programs via Control Flow Flattening"** (Wang et al., 2001)
  - Seminal work on control flow flattening
  - Introduces dispatcher-based approach
  - LLVM-compatible techniques
  
- **"A Generic Approach to Automatic Deobfuscation of Executable Code"** (Udupa et al., 2005)
  - Analysis of flattening effectiveness
  - Resilience metrics
  - Deobfuscation challenges

- **"Control Flow Flattening for Code Obfuscation"** (Laszlo & Kiss, 2009)
  - Modern flattening algorithms
  - Performance analysis
  - Implementation patterns

#### 2. Bogus Code Insertion
- **"Manufacturing Cheap, Resilient, and Stealthy Opaque Constructs"** (Collberg et al., 1998)
  - Opaque predicate theory
  - Construction techniques
  - Resilience analysis

- **"Opaque Predicates Detection by Abstract Interpretation"** (Dalla Preda et al., 2006)
  - Detection resistance
  - Advanced opaque constructs
  - Static analysis countermeasures

- **"Stealthy Code Obfuscation Technique for Software Protection"** (Banescu et al., 2015)
  - Stealthy bogus code patterns
  - Overhead minimization
  - Effectiveness metrics

#### 3. String Encryption
- **"String Obfuscation Techniques"** (Ceccato et al., 2014)
  - Comprehensive string protection methods
  - Encryption algorithms for code
  - Performance considerations

- **"Protecting Software through Obfuscation: Can It Keep Pace with Progress in Code Analysis?"** (Schrittwieser et al., 2016)
  - Modern string protection
  - Analysis resistance
  - Future directions

#### 4. Multi-Pass & Hybrid Techniques
- **"Layered Obfuscation: A Taxonomy of Software Obfuscation Techniques for Layered Security"** (Banescu et al., 2016)
  - Multi-layer obfuscation strategies
  - Combination effectiveness
  - Security analysis

- **"Obfuscator-LLVM: Software Protection for the Masses"** (Junod et al., 2015)
  - LLVM-based obfuscation framework
  - Pass implementation details
  - Real-world applications

- **"Code Obfuscation Against Symbolic Execution Attacks"** (Banescu et al., 2017)
  - Advanced protection techniques
  - Symbolic execution resistance
  - Hybrid approaches

#### 5. Metrics & Evaluation
- **"Measuring Software Obfuscation"** (Collberg et al., 1997)
  - Potency, resilience, cost metrics
  - Evaluation framework
  - Benchmarking methods

- **"SoK: Cryptographically Protected Database Search"** (Fuller et al., 2017)
  - Security metrics
  - Effectiveness evaluation
  - Comparative analysis

---

## 🏗️ RAG System Architecture

### Project Structure

```
rag-system/
├── papers/
│   ├── control-flow/
│   │   ├── wang-2001-flattening.pdf
│   │   ├── udupa-2005-deobfuscation.pdf
│   │   └── laszlo-2009-flattening.pdf
│   ├── bogus-code/
│   │   ├── collberg-1998-opaque.pdf
│   │   ├── dalla-preda-2006-detection.pdf
│   │   └── banescu-2015-stealthy.pdf
│   ├── string-encryption/
│   │   ├── ceccato-2014-strings.pdf
│   │   └── schrittwieser-2016-protection.pdf
│   ├── multi-pass/
│   │   ├── banescu-2016-layered.pdf
│   │   ├── junod-2015-ollvm.pdf
│   │   └── banescu-2017-symbolic.pdf
│   └── metadata.json
├── embeddings/
│   └── chroma_db/
├── src/
│   ├── ingest.py
│   ├── query.py
│   ├── chunking.py
│   ├── embeddings.py
│   └── watsonx_client.py
├── config/
│   ├── watsonx.yaml
│   └── chunking.yaml
├── tests/
│   ├── test_ingestion.py
│   └── test_retrieval.py
├── requirements.txt
└── README.md
```

---

## 📄 Paper Metadata Schema

```json
{
  "papers": [
    {
      "id": "wang-2001-flattening",
      "title": "Obfuscating C++ Programs via Control Flow Flattening",
      "authors": ["Chenxi Wang", "Jonathan Hill", "John Knight", "Jack Davidson"],
      "year": 2001,
      "venue": "ICICS",
      "technique": "control_flow_flattening",
      "tags": ["cfg", "dispatcher", "static-analysis-resistant"],
      "complexity": "high",
      "effectiveness": 0.85,
      "llvm_compatible": true,
      "implementation_difficulty": "medium",
      "performance_overhead": "15-25%",
      "resilience_score": 0.78,
      "key_contributions": [
        "Dispatcher-based control flow flattening",
        "Switch statement transformation",
        "Basic block reordering"
      ],
      "algorithms": [
        "Control flow graph flattening",
        "State variable introduction",
        "Dispatcher loop creation"
      ],
      "limitations": [
        "Increased code size",
        "Performance overhead",
        "May be detected by pattern matching"
      ],
      "file_path": "papers/control-flow/wang-2001-flattening.pdf",
      "page_count": 15,
      "citation_count": 450
    }
  ]
}
```

---

## 🔧 Implementation

### 1. Document Ingestion Pipeline

```python
# rag-system/src/ingest.py

import json
import hashlib
from pathlib import Path
from typing import List, Dict
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from watsonx_client import WatsonxEmbeddings

class PaperIngestor:
    def __init__(self, config_path: str = "config/watsonx.yaml"):
        self.config = self.load_config(config_path)
        self.embeddings = WatsonxEmbeddings(
            model_id="ibm/slate-125m-english-rtrvr",
            credentials=self.config['credentials']
        )
        self.vector_store = Chroma(
            persist_directory="embeddings/chroma_db",
            embedding_function=self.embeddings
        )
        self.metadata = self.load_metadata()
    
    def load_config(self, path: str) -> Dict:
        """Load watsonx.ai configuration"""
        import yaml
        with open(path, 'r') as f:
            return yaml.safe_load(f)
    
    def load_metadata(self) -> Dict:
        """Load paper metadata"""
        with open('papers/metadata.json', 'r') as f:
            return json.load(f)
    
    def ingest_paper(self, paper_id: str) -> None:
        """Ingest a single paper"""
        # Get paper metadata
        paper_meta = next(
            (p for p in self.metadata['papers'] if p['id'] == paper_id),
            None
        )
        if not paper_meta:
            raise ValueError(f"Paper {paper_id} not found in metadata")
        
        print(f"Ingesting: {paper_meta['title']}")
        
        # Load PDF
        loader = PyPDFLoader(paper_meta['file_path'])
        documents = loader.load()
        
        # Chunk documents
        chunks = self.chunk_documents(documents, paper_meta)
        
        # Add to vector store
        self.vector_store.add_documents(chunks)
        
        print(f"✓ Ingested {len(chunks)} chunks from {paper_id}")
    
    def chunk_documents(
        self, 
        documents: List, 
        metadata: Dict
    ) -> List:
        """Chunk documents with semantic awareness"""
        
        # Create splitter with custom separators
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=[
                "\n\n",  # Paragraph breaks
                "\n",    # Line breaks
                ". ",    # Sentence breaks
                " "      # Word breaks
            ],
            length_function=len
        )
        
        chunks = splitter.split_documents(documents)
        
        # Enhance metadata for each chunk
        for i, chunk in enumerate(chunks):
            chunk.metadata.update({
                "paper_id": metadata['id'],
                "title": metadata['title'],
                "authors": ", ".join(metadata['authors']),
                "year": metadata['year'],
                "technique": metadata['technique'],
                "complexity": metadata['complexity'],
                "effectiveness": metadata['effectiveness'],
                "llvm_compatible": metadata['llvm_compatible'],
                "tags": ", ".join(metadata['tags']),
                "chunk_index": i,
                "total_chunks": len(chunks)
            })
            
            # Add content hash for deduplication
            content_hash = hashlib.sha256(
                chunk.page_content.encode()
            ).hexdigest()[:16]
            chunk.metadata['content_hash'] = content_hash
        
        return chunks
    
    def ingest_all(self) -> None:
        """Ingest all papers from metadata"""
        for paper in self.metadata['papers']:
            try:
                self.ingest_paper(paper['id'])
            except Exception as e:
                print(f"✗ Failed to ingest {paper['id']}: {e}")
    
    def update_paper(self, paper_id: str) -> None:
        """Update a specific paper (re-ingest)"""
        # Delete existing chunks
        self.vector_store.delete(
            filter={"paper_id": paper_id}
        )
        # Re-ingest
        self.ingest_paper(paper_id)

# CLI interface
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Ingest research papers into RAG system"
    )
    parser.add_argument(
        "--papers",
        type=str,
        help="Comma-separated paper IDs to ingest"
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Ingest all papers"
    )
    
    args = parser.parse_args()
    
    ingestor = PaperIngestor()
    
    if args.all:
        ingestor.ingest_all()
    elif args.papers:
        for paper_id in args.papers.split(','):
            ingestor.ingest_paper(paper_id.strip())
    else:
        print("Please specify --papers or --all")
```

---

### 2. Query Interface

```python
# rag-system/src/query.py

from typing import List, Dict, Optional
from langchain.vectorstores import Chroma
from watsonx_client import WatsonxEmbeddings, WatsonxLLM
import json

class ObfuscationRAG:
    def __init__(self):
        self.embeddings = WatsonxEmbeddings(
            model_id="ibm/slate-125m-english-rtrvr"
        )
        self.vector_store = Chroma(
            persist_directory="embeddings/chroma_db",
            embedding_function=self.embeddings
        )
        self.llm = WatsonxLLM(
            model_id="ibm/granite-13b-chat-v2",
            parameters={
                "max_new_tokens": 500,
                "temperature": 0.3,
                "top_p": 0.9
            }
        )
    
    def query_technique(
        self,
        ir_context: str,
        technique_type: str,
        max_results: int = 3
    ) -> Dict:
        """Query for obfuscation technique recommendations"""
        
        # Create contextual query
        query = self.build_query(ir_context, technique_type)
        
        # Hybrid search: vector + keyword
        results = self.hybrid_search(
            query=query,
            technique=technique_type,
            k=max_results
        )
        
        # Generate response with LLM
        response = self.generate_response(query, results)
        
        return {
            "recommendation": response,
            "sources": [self.format_source(r) for r in results],
            "confidence": self.calculate_confidence(results)
        }
    
    def build_query(self, ir_context: str, technique: str) -> str:
        """Build contextual query from IR context"""
        
        # Truncate IR context if too long
        if len(ir_context) > 2000:
            ir_context = ir_context[:2000] + "..."
        
        query = f"""
Given this LLVM IR context:
{ir_context}

Recommend {technique} obfuscation approach that:
1. Preserves program semantics
2. Maximizes complexity increase
3. Minimizes performance overhead
4. Is resilient to static analysis

Consider: LLVM compatibility, implementation difficulty, effectiveness.
"""
        return query
    
    def hybrid_search(
        self,
        query: str,
        technique: str,
        k: int = 5
    ) -> List:
        """Hybrid search: vector similarity + keyword matching"""
        
        # Vector similarity search (70% weight)
        vector_results = self.vector_store.similarity_search_with_score(
            query=query,
            k=k * 2,
            filter={"technique": technique}
        )
        
        # Keyword search (30% weight) - using BM25
        keyword_results = self.keyword_search(query, technique, k * 2)
        
        # Combine and re-rank
        combined = self.combine_results(
            vector_results,
            keyword_results,
            vector_weight=0.7,
            keyword_weight=0.3
        )
        
        return combined[:k]
    
    def keyword_search(
        self,
        query: str,
        technique: str,
        k: int
    ) -> List:
        """BM25 keyword search"""
        from rank_bm25 import BM25Okapi
        
        # Get all documents for technique
        docs = self.vector_store.get(
            where={"technique": technique}
        )
        
        # Tokenize
        tokenized_docs = [doc.split() for doc in docs['documents']]
        tokenized_query = query.split()
        
        # BM25 ranking
        bm25 = BM25Okapi(tokenized_docs)
        scores = bm25.get_scores(tokenized_query)
        
        # Get top-k
        top_indices = sorted(
            range(len(scores)),
            key=lambda i: scores[i],
            reverse=True
        )[:k]
        
        return [
            (docs['documents'][i], scores[i])
            for i in top_indices
        ]
    
    def combine_results(
        self,
        vector_results: List,
        keyword_results: List,
        vector_weight: float,
        keyword_weight: float
    ) -> List:
        """Combine and re-rank results"""
        
        # Normalize scores
        max_vector = max(score for _, score in vector_results)
        max_keyword = max(score for _, score in keyword_results)
        
        combined_scores = {}
        
        # Add vector results
        for doc, score in vector_results:
            doc_id = doc.metadata['content_hash']
            normalized = score / max_vector if max_vector > 0 else 0
            combined_scores[doc_id] = {
                'doc': doc,
                'score': normalized * vector_weight
            }
        
        # Add keyword results
        for doc, score in keyword_results:
            doc_id = doc.metadata['content_hash']
            normalized = score / max_keyword if max_keyword > 0 else 0
            
            if doc_id in combined_scores:
                combined_scores[doc_id]['score'] += normalized * keyword_weight
            else:
                combined_scores[doc_id] = {
                    'doc': doc,
                    'score': normalized * keyword_weight
                }
        
        # Sort by combined score
        sorted_results = sorted(
            combined_scores.values(),
            key=lambda x: x['score'],
            reverse=True
        )
        
        return [item['doc'] for item in sorted_results]
    
    def generate_response(self, query: str, results: List) -> str:
        """Generate contextualized response using LLM"""
        
        # Build context from retrieved chunks
        context = "\n\n".join([
            f"[{r.metadata['title']} ({r.metadata['year']})]:\n{r.page_content}"
            for r in results
        ])
        
        # Create prompt
        prompt = f"""Based on the following research papers:

{context}

{query}

Provide a detailed recommendation including:
1. Specific technique to use
2. Implementation approach
3. Expected complexity increase
4. Performance overhead estimate
5. LLVM-specific considerations

Be concise and technical."""
        
        # Generate response
        response = self.llm.generate(prompt)
        
        return response
    
    def calculate_confidence(self, results: List) -> float:
        """Calculate confidence score for recommendations"""
        
        if not results:
            return 0.0
        
        # Factors:
        # 1. Number of relevant papers found
        # 2. Recency of papers
        # 3. Citation counts
        # 4. LLVM compatibility
        
        num_papers = len(results)
        avg_year = sum(r.metadata['year'] for r in results) / num_papers
        llvm_compatible = sum(
            1 for r in results if r.metadata['llvm_compatible']
        ) / num_papers
        
        # Normalize to 0-1
        recency_score = min((avg_year - 2000) / 25, 1.0)
        coverage_score = min(num_papers / 5, 1.0)
        
        confidence = (
            coverage_score * 0.4 +
            recency_score * 0.3 +
            llvm_compatible * 0.3
        )
        
        return round(confidence, 2)
    
    def format_source(self, doc) -> Dict:
        """Format source information"""
        return {
            "title": doc.metadata['title'],
            "authors": doc.metadata['authors'],
            "year": doc.metadata['year'],
            "technique": doc.metadata['technique'],
            "effectiveness": doc.metadata['effectiveness'],
            "excerpt": doc.page_content[:200] + "..."
        }

# Example usage
if __name__ == "__main__":
    rag = ObfuscationRAG()
    
    ir_context = """
    define i32 @main() {
    entry:
      %x = alloca i32
      store i32 42, i32* %x
      %y = load i32, i32* %x
      ret i32 %y
    }
    """
    
    result = rag.query_technique(
        ir_context=ir_context,
        technique_type="control_flow_flattening",
        max_results=3
    )
    
    print(json.dumps(result, indent=2))
```

---

### 3. watsonx.ai Client

```python
# rag-system/src/watsonx_client.py

from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai.foundation_models import Embeddings, Model
from typing import List
import os

class WatsonxEmbeddings:
    def __init__(self, model_id: str, credentials: dict = None):
        self.model_id = model_id
        self.credentials = credentials or self.get_credentials()
        self.embeddings = Embeddings(
            model_id=self.model_id,
            credentials=self.credentials
        )
    
    def get_credentials(self) -> Credentials:
        """Get watsonx.ai credentials from environment"""
        return Credentials(
            api_key=os.getenv('WATSONX_API_KEY'),
            url=os.getenv('WATSONX_URL', 'https://us-south.ml.cloud.ibm.com')
        )
    
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed multiple documents"""
        return self.embeddings.embed_documents(texts)
    
    def embed_query(self, text: str) -> List[float]:
        """Embed a single query"""
        return self.embeddings.embed_query(text)

class WatsonxLLM:
    def __init__(self, model_id: str, parameters: dict = None):
        self.model_id = model_id
        self.parameters = parameters or {}
        self.credentials = self.get_credentials()
        self.model = Model(
            model_id=self.model_id,
            credentials=self.credentials,
            params=self.parameters,
            project_id=os.getenv('WATSONX_PROJECT_ID')
        )
    
    def get_credentials(self) -> Credentials:
        """Get watsonx.ai credentials"""
        return Credentials(
            api_key=os.getenv('WATSONX_API_KEY'),
            url=os.getenv('WATSONX_URL', 'https://us-south.ml.cloud.ibm.com')
        )
    
    def generate(self, prompt: str) -> str:
        """Generate response from prompt"""
        response = self.model.generate_text(prompt)
        return response
```

---

## 🚀 Deployment & Usage

### Installation

```bash
cd rag-system

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### requirements.txt

```
ibm-watsonx-ai>=0.2.0
langchain>=0.1.0
chromadb>=0.4.0
pypdf>=3.17.0
rank-bm25>=0.2.2
pyyaml>=6.0
```

### Configuration

```yaml
# config/watsonx.yaml

credentials:
  api_key: ${WATSONX_API_KEY}
  url: https://us-south.ml.cloud.ibm.com
  project_id: ${WATSONX_PROJECT_ID}

embedding_model:
  id: ibm/slate-125m-english-rtrvr
  dimensions: 384

llm_model:
  id: ibm/granite-13b-chat-v2
  parameters:
    max_new_tokens: 500
    temperature: 0.3
    top_p: 0.9
    repetition_penalty: 1.1

cache:
  enabled: true
  ttl: 3600
  backend: redis
  redis_url: redis://localhost:6379
```

### Usage Examples

```bash
# Ingest all papers
python src/ingest.py --all

# Ingest specific papers
python src/ingest.py --papers wang-2001-flattening,junod-2015-ollvm

# Query for technique
python src/query.py \
  --technique control_flow_flattening \
  --context "define i32 @main() { ... }"

# Update a paper
python src/ingest.py --update wang-2001-flattening
```

---

## 📊 Evaluation Metrics

### Retrieval Quality

```python
# tests/test_retrieval.py

def evaluate_retrieval_quality():
    """Evaluate RAG retrieval quality"""
    
    test_queries = [
        {
            "query": "How to flatten control flow in LLVM?",
            "expected_technique": "control_flow_flattening",
            "expected_papers": ["wang-2001", "laszlo-2009"]
        },
        # ... more test queries
    ]
    
    rag = ObfuscationRAG()
    
    precision_scores = []
    recall_scores = []
    
    for test in test_queries:
        results = rag.query_technique(
            ir_context=test["query"],
            technique_type=test["expected_technique"]
        )
        
        retrieved_papers = [
            s['title'] for s in results['sources']
        ]
        
        # Calculate precision and recall
        relevant = set(test["expected_papers"])
        retrieved = set(retrieved_papers)
        
        precision = len(relevant & retrieved) / len(retrieved)
        recall = len(relevant & retrieved) / len(relevant)
        
        precision_scores.append(precision)
        recall_scores.append(recall)
    
    print(f"Average Precision: {sum(precision_scores) / len(precision_scores):.2f}")
    print(f"Average Recall: {sum(recall_scores) / len(recall_scores):.2f}")
```

---

## 🎯 Success Criteria

- **Retrieval Accuracy**: >80% for relevant papers
- **Query Latency**: <2 seconds per query
- **Cache Hit Rate**: >70% for common queries
- **Recommendation Quality**: High confidence (>0.7) for standard techniques
- **Coverage**: All major obfuscation techniques represented

---

## 📝 Next Steps

1. Collect and organize research papers
2. Create comprehensive metadata.json
3. Implement ingestion pipeline
4. Set up vector database
5. Implement query interface
6. Integrate with MCP server
7. Test retrieval quality
8. Optimize performance
9. Deploy to production

This RAG strategy provides Bob with access to cutting-edge obfuscation research, enabling informed and effective transformation decisions!