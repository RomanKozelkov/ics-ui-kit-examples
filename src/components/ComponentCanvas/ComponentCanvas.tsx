import { UiComponent } from "../../data/types";
import * as UiComponents from "../../examples";
import { ComponentPreview } from "../ComponentPreview/ComponentPreview";

export function ComponentCanvas(props: UiComponent) {
	const Component = UiComponents[props.component];

	return (
		<div>
			<ComponentPreview classNames={props.attributes.canvas.classNames}>
				<Component {...props.attributes.props} />
			</ComponentPreview>
		</div>
	);
}

// export function ComponentCanvas(props: UiComponent & { zIndex: number }) {
// 	const [state, setState] = useState('preview');
// 	const [primaryColor, setPrimaryColor] = useState('blue');
// 	const Component: any = UiComponents[props.component as keyof typeof UiComponents];

// 	return (
// 	  <div className={classes.canvas}>
// 		<CanvasHeader
// 		  {...props}
// 		  state={state}
// 		  primaryColor={primaryColor}
// 		  onStateChange={setState}
// 		  onPrimaryColorChange={setPrimaryColor}
// 		/>

// 		<div
// 		  className={cx(classes.body, {
// 			[classes.bodyWithCode]: state === 'code',
// 			[classes.bodyRaw]: !props.attributes.canvas.center,
// 		  })}
// 		>
// 		  {state === 'preview' ? (
// 			<Box
// 			  mod={{ dimmed: props.attributes.dimmed }}
// 			  className={classes.preview}
// 			  style={{ zIndex: props.zIndex }}
// 			>
// 			  <ComponentPreview canvas={props.attributes.canvas}>
// 				<MantineThemeProvider inherit theme={{ primaryColor }}>
// 				  <Component {...props.attributes.props} />
// 				</MantineThemeProvider>
// 			  </ComponentPreview>
// 			</Box>
// 		  ) : (
// 			<Box pos="relative">
// 			  <CodeHighlightTabs code={props.code as any} getFileIcon={getCodeFileIcon} />
// 			</Box>
// 		  )}
// 		</div>
// 	  </div>
// 	);
//   }
