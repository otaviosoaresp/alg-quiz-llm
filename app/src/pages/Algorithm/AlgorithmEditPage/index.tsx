import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Algorithm } from '../../../types/Algorithm';

import { updateAlgorithmUseCase } from '../../../usecases/Algorithm/updateAlgorithm.usecase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAlgorithmByIdUseCase } from '@/usecases/Algorithm/fetchAlgorithmsById.usecase';

languages.python = {
  ...languages.python,
  'operator': /[=:]/
};

export const AlgorithmEditPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadAlgorithm = async () => {
			if (!id) return;
			try {
				setIsLoading(true);
				const data = await fetchAlgorithmByIdUseCase(parseInt(id, 10));
				setAlgorithm(data);
				setError(null);
			} catch (err) {
				setError('Failed to load algorithm. Please try again later.');
			} finally {
				setIsLoading(false);
			}
		};

		loadAlgorithm();
	}, [id]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (algorithm) {
			setAlgorithm({ ...algorithm, [e.target.name]: e.target.value });
		}
	};

	const handleCodeChange = (code: string) => {
		if (algorithm) {
			setAlgorithm({ ...algorithm, solution_code: code });
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!algorithm) return;

		try {
			await updateAlgorithmUseCase(algorithm.id, algorithm);
			navigate('/algoritmos');
		} catch (err) {
			setError('Failed to update algorithm. Please try again.');
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!algorithm) {
		return <div>Algorithm not found</div>;
	}

	return (
		<div className="container mx-auto py-6">
			<Card>
				<CardHeader>
					<CardTitle>Edit Algorithm</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								type="text"
								id="name"
								name="name"
								value={algorithm.name}
								onChange={handleInputChange}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								name="description"
								value={algorithm.description}
								onChange={handleInputChange}
								rows={10}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="solutionCode">Solution Code</Label>
							<div className="border rounded-md overflow-hidden">
								<Editor
									value={algorithm.solution_code}
									onValueChange={handleCodeChange}
									highlight={code => highlight(code, languages.python, 'python')}
									padding={16}
									style={{
										fontFamily: '"Fira code", "Fira Mono", monospace',
										fontSize: 14,
										backgroundColor: 'transparent',
										minHeight: '300px',
									}}
									textareaClassName="focus:outline-none"
								/>
							</div>
						</div>
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