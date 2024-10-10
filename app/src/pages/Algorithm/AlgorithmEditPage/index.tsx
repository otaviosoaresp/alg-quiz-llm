import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeEditor } from '../components/CodeEditor';
import { TagInput } from '@/components/TagInput';
import { useAlgorithm } from '@/hooks/useAlgorithm';
import { useTags } from '@/hooks/useTags';
import { Tag } from '@/types/tag';

export const AlgorithmEditPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { algorithm, setAlgorithm, isLoading, error, updateAlgorithm } = useAlgorithm(id);
	const { tags, isLoading: isLoadingTags, error: tagsError } = useTags();

	if (isLoading || isLoadingTags) return <div>Loading...</div>;
	if (error || tagsError) return <div>Error: {error || tagsError}</div>;
	if (!algorithm) return <div>Algorithm not found</div>;

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setAlgorithm({ ...algorithm, [e.target.name]: e.target.value });
	};

	const handleCodeChange = (code: string) => {
		setAlgorithm({ ...algorithm, solution_code: code });
	};

	const handleTagSelect = (tag: Tag) => {
		if (!algorithm.tags.some(t => t.name.toLowerCase() === tag.name.toLowerCase())) {
			setAlgorithm({ ...algorithm, tags: [...algorithm.tags, tag] });
		}
	};

	const handleTagCreate = (tagName: string) => {
		const newTag: Tag = { id: null, name: tagName };
		setAlgorithm({ ...algorithm, tags: [...algorithm.tags, newTag] });
	};

	const handleTagRemove = (tagToRemove: Tag) => {
		setAlgorithm({
			...algorithm,
			tags: algorithm.tags.filter(tag => tag.name !== tagToRemove.name)
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await updateAlgorithm(algorithm);
		navigate('/algoritmos');
	};

	return (
		<div className="container mx-auto py-6">
			<Card>
				<CardHeader>
					<CardTitle>Edit Algorithm</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<AlgorithmFormField label="Name" id="name">
							<Input
								type="text"
								id="name"
								name="name"
								value={algorithm.name}
								onChange={handleInputChange}
							/>
						</AlgorithmFormField>
						<AlgorithmFormField label="Description" id="description">
							<Textarea
								id="description"
								name="description"
								value={algorithm.description}
								onChange={handleInputChange}
								rows={10}
							/>
						</AlgorithmFormField>
						<AlgorithmFormField label="Tags">
							<TagInput
								tags={tags}
								selectedTags={algorithm.tags}
								onTagSelect={handleTagSelect}
								onTagRemove={handleTagRemove}
								onTagCreate={handleTagCreate}
							/>
						</AlgorithmFormField>
						<AlgorithmFormField label="Solution Code" id="solutionCode">
							<CodeEditor
								value={algorithm.solution_code}
								onChange={handleCodeChange}
							/>
						</AlgorithmFormField>
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => navigate('/algoritmos')}>Cancel</Button>
							<Button type="submit">Save Changes</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

const AlgorithmFormField: React.FC<{label: string; id?: string; children: React.ReactNode}> = ({label, id, children}) => (
	<div className="space-y-2">
		<label htmlFor={id} className="text-sm font-medium">{label}</label>
		{children}
	</div>
);