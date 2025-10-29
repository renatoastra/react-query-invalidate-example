# **🚀 React Query: Padrão de Invalidação Automática (Exemplo)**

Este repositório é um projeto de exemplo que demonstra um padrão de arquitetura  para gerenciar listas complexas (Datatables) em React. O objetivo é eliminar o estado manual (useState) e garantir que os dados estejam sempre sincronizados automaticamente após *mutations* (criação, atualização, exclusão) usando o **React Query**.

Este padrão é baseado na apresentação técnica: "React Query: Eliminando Estado Manual com Invalidação Automática".

## **😩 O Problema: Gerenciamento de Estado Manual**

Gerenciar listas complexas, como Datatables com múltiplas funcionalidades, torna-se um desafio significativo conforme a aplicação cresce. Essa complexidade é agravada quando desenvolvedores com diferentes níveis de experiência precisam dar manutenção no código.

O uso de useState para controlar dados que vêm do servidor nos leva a vários problemas.

### **Antes (O Padrão Manual)**

// ❌ O jeito "tradicional" com useState  
const \[data, setData\] \= useState(\[\]);  
const \[loading, setLoading\] \= useState(false);

const handleCreate \= async () \=\> {  
  setLoading(true);  
  await createItem();  
  setLoading(false);  
    
  // 😰 E agora? Como atualizar a lista?  
  // 😰 E se houver filtros aplicados?  
  // 😰 E se houver paginação?  
};

Isso nos leva a:

* 🔴 **Dados desatualizados** após *mutations*.  
* 🔴 **Estados inconsistentes** entre componentes.  
* 🔴 **Código repetitivo** e complexo para sincronizar filtros, paginação e dados.  
* 🔴 **Bugs difíceis** de debugar.

## **✨ A Solução: Invalidação Automática de Queries**

Este padrão move a responsabilidade do "estado do servidor" para o React Query. Em vez de gerenciar o estado manualmente, nós simplesmente "avisamos" ao React Query que os dados daquela lista estão desatualizados, e ele cuida de buscá-los novamente para nós.

### **Depois (O Padrão React Query)**

// ✅ A solução com React Query

// 3\. A Mutation Hook invalida a query  
const { mutate } \= useMutation({  
  mutationFn: createCollect,  
  onSuccess: () \=\> {  
    // 🎯 Mágica\! Apenas dizemos ao React Query que os dados estão "sujos".  
    invalidateCollectList();   
  }  
});

// 1\. A Query Hook busca os dados  
const { data } \= useQuery({  
  queryKey: indicatorCollectsQueryKey(id, params), // 2\. Usando uma chave centralizada  
  queryFn: () \=\> getCollects(id, params)  
});

### **Benefícios**

* ✅ **Zero estado manual** para dados do servidor.  
* ✅ **Dados sempre atualizados** automaticamente.  
* ✅ **Menos bugs** e código mais limpo.  
* ✅ **Melhor Experiência do Usuário (UX)**, sem loaders manuais.

## **🛠️ Implementação do Padrão (Como funciona)**

O código neste repositório está estruturado em volta de 4 conceitos principais:

### **1\. Query Keys Centralizadas**

Para que a invalidação funcione, nossas *query keys* precisam ser consistentes e previsíveis. Nós as centralizamos em um único local.

// constants/query-keys.ts

/\*\*  
 \* Chave para a lista de coletas de um indicador, com filtros e paginação.  
 \*/  
const indicatorCollectsQueryKey \= (  
  indicatorId: string,   
  params: FilterPagination  
) \=\> \[  
  'indicator-collects',   
  indicatorId,   
  params  
\] as const;

### **2\. O Hook de Query (useGetCollect)**

Este hook é responsável por buscar os dados. Ele usa a *query key* centralizada.

// hooks/queries/use-get-collect/index.ts

const useGetCollect \= ({ indicatorId, ...pagination }) \=\> {  
  const { data, isLoading } \= useQuery({  
    // Usa a chave centralizada  
    queryKey: indicatorCollectsQueryKey(indicatorId, pagination),  
    queryFn: () \=\> getCollects(indicatorId, pagination),  
    options: {  
      enabled: \!\!indicatorId, // Só busca se o indicatorId existir  
      placeholderData: (previousData) \=\> (previousData ?? DEFAULT\_DATA)  
    }  
  });

  return { collectData: data, isLoadingCollectData: isLoading };  
};

### **3\. O Hook de Mutation (useCreateCollect)**

Este hook é responsável por criar um novo item. No onSuccess, ele chama o hook de invalidação.

// hooks/mutations/use-create-collect/index.ts

const useCreateCollect \= ({ indicatorId, onSuccess, onError }) \=\> {  
  // 1\. Pega a função de invalidação  
  const invalidateCollectList \= useInvalidateCollectList(indicatorId);  
    
  const { mutate: createCollect, isPending } \= useMutation({  
    mutationFn: (indicatorId: string) \=\> postCollects(indicatorId),  
    options: {  
      onSuccess: () \=\> {  
        onSuccess?.();  
        // 2\. Chama a invalidação\!  
        invalidateCollectList();   
      },  
      onError: (error) \=\> { /\* ...tratar erro... \*/ }  
    }  
  });

  return { createCollect, isPendingCreateCollect: isPending };  
};

### **4\. O Hook de Invalidação (useInvalidateCollectList)**

Este é o cérebro da operação. É um hook reutilizável que sabe exatamente qual *query key* invalidar com base nos filtros e paginação atuais (que ele pode pegar de um Contexto ou Zustand).

// hooks/use-invalidate-collect-list/index.ts

const useInvalidateCollectList \= (indicatorId: string) \=\> {  
  const queryClient \= useQueryClient();  
    
  // Pega a paginação atual de um contexto/store  
  const { amountPerPage, currentPage } \= useCollectPagination();

  const invalidateCollectList \= useCallback(() \=\> {  
    // Invalida a query exata que está sendo usada pela lista  
    queryClient.invalidateQueries({   
      queryKey: indicatorCollectsQueryKey(  
        indicatorId,   
        { amountPerPage, page: currentPage }  
      )   
    });  
  }, \[queryClient, indicatorId, amountPerPage, currentPage\]);

  return invalidateCollectList;  
};

## **📦 Como Executar o Exemplo**

Este projeto foi inicializado com npx create-next-app@latest 

### **Pré-requisitos**

* Node.js (v16 ou superior)  
* Yarn (ou npm)

### **Instalação**

1. Clone o repositório:  
   git clone https://github.com/renatoastra/react-query-invalidate-example 
   cd react-query-invalidate-example  

2. Instale as dependências:  
   pnpm install

   ou  
   npm install

### **Rodando o Projeto**

1. Inicie o servidor de desenvolvimento:  
   pnpm dev

   ou  
   npm run dev

2. Abra [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) (ou a porta indicada no seu terminal) no seu navegador.

## **📄 Licença**

Este projeto foi criado para apresentar para a equipe de front-end da Qualyteam.